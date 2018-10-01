import fs from 'fs';
import { promisify } from 'util';
import Promise from 'promise';
import axios from 'axios';
import request from 'requisition';
import AwsSdk from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import https from 'https';
// import stream from 'stream';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

AWSXRay.captureHTTPsGlobal(https);
AWSXRay.capturePromise();
const AWS = AWSXRay.captureAWS(AwsSdk);

const s3 = new AWS.S3();
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const FEED = 'https://archive.org/details/tv?weekshows&output=json';
const CHANNELS = ['CNNW', 'MSNBCW', 'FOXNEWSW', 'BBCNEWS'];


export const feed = async (event, context, cb) => {
  const yesterday = dateParts(new Date(Date.now() - 86400000)).slice(0,3).join('');
  const today = dateParts(new Date()).slice(0,3).join('');

  const downloaded = (await Promise.all([
    s3.listObjectsV2({
      Bucket: process.env.BUCKET_NAME,
      Prefix: `tva/${yesterday}`,
    }).promise(),
    s3.listObjectsV2({
      Bucket: process.env.BUCKET_NAME,
      Prefix: `tva/${today}`,
    }).promise(),
  ])).reduce((acc, data) => [...acc, ...data.Contents.map(object => object.Key.split('/').pop().replace('_tva.afpt', ''))], []);

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


export const fingerprint = async (event, context, cb) => {
  const segment = event.Records[0].body;
  const channel = event.Records[0].messageAttributes.Channel.stringValue;
  const date = event.Records[0].messageAttributes.Date.stringValue;

  const response = await request(`https://archive.org/download/${segment}/${segment}_tva.afpt`);
  await response.saveTo(`/tmp/${segment}_tva.afpt`);

  const fingerprint = await readFile(`/tmp/${segment}_tva.afpt`);
  await s3.putObject({
    Body: fingerprint,
    ACL: 'public-read',
    Bucket: process.env.BUCKET_NAME,
    Key: `tva/${date}/${channel}/${segment}_tva.afpt`,
  }).promise();

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
