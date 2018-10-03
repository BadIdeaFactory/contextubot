import fs from 'fs';
import { promisify } from 'util';
import Promise from 'promise';
import axios from 'axios';
import request from 'requisition';
import AwsSdk from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import https from 'https';


const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

AWSXRay.captureHTTPsGlobal(https);
AWSXRay.capturePromise();
const AWS = AWSXRay.captureAWS(AwsSdk);

const s3 = new AWS.S3();
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

// const CHANNELS = ['CNNW', 'MSNBCW', 'FOXNEWSW', 'BBCNEWS'];


export const fingerprint = async (event, context, cb) => {
  if (!event.Records[0].s3) return cb(null, { event });

  const currMonth = dateParts(new Date()).slice(0,2).join('');

  const hashes = (await Promise.all([
    s3.listObjectsV2({
      Bucket: process.env.BUCKET_NAME,
      Prefix: `hash/${currMonth}`,
    }).promise(),
    // s3.listObjectsV2({
    //   Bucket: process.env.BUCKET_NAME,
    //   Prefix: `hash/${prevMonth}`,
    // }).promise(),
  ])).reduce((acc, data) => [...acc, ...data.Contents.map(object => object.Key.split('/').pop())], []);

  const batches = (await axios.get(FEED)).data.filter((segment) => {
    const [ channel, date ] = segment.split('_');
    return (date === today || date === yesterday) && CHANNELS.includes(channel) && !downloaded.includes(segment);
  }).reduce((acc, segment, i) => (i % 10 ? acc[acc.length - 1].push(segment) : acc.push([ segment ])) && acc, []);

  await Promise.all(batches.map(batch => sqs.sendMessageBatch({
    QueueUrl: process.env.TVA_QUEUE,
    Entries: batch.map((segment) => {
      const [ channel, date, time, ...title ] = segment.split('_');
      return {
        Id: `${channel}-${date}-${time}`,
        MessageAttributes: {
          Title: {
            DataType: 'String',
            StringValue: title.join(' '),
          },
          Channel: {
            DataType: 'String',
            StringValue: channel,
          },
          Date: {
            DataType: 'String',
            StringValue: date,
          },
        },
        MessageBody: segment,
      };
    }),
  }).promise()));

  cb(null, {
    statusCode: 200,
    body: JSON.stringify({ event }),
  });
};




const dateParts = (date) => {
  const parts = new Intl.DateTimeFormat('en-gb', {
    timeZone: 'UTC',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date).filter(p => p.type !== 'literal').map(p => p.value);
  return [ parts[2], parts[0], parts[1], ...parts.slice(3) ];
}
