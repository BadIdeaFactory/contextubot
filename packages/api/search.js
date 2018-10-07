import fs from 'fs';
import { promisify } from 'util';
import Promise from 'promise';
import axios from 'axios';
import request from 'requisition';
import AwsSdk from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import https from 'https';
import PubNub from 'pubnub';


const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

AWSXRay.captureHTTPsGlobal(https);
AWSXRay.capturePromise();
const AWS = AWSXRay.captureAWS(AwsSdk);

const s3 = new AWS.S3();
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUB,
  subscribeKey: process.env.PUBNUB_SUB,
});

// const CHANNELS = ['CNNW', 'MSNBCW', 'FOXNEWSW', 'BBCNEWS'];

export const fingerprint = async (event, context, cb) => {
  if (!event.Records[0].s3) return cb(null, { event });

  // const currMonth = dateParts(new Date()).slice(0,2).join('');

  const key = event.Records[0].s3.object.key;
  const id = key.split('/')[1];
  pubnub.publish({
    channel: id,
    message: {
      search: {
        id,
      }
    }
  }, (status, response) => {
    console.log(status, response);
  });

  pubnub.publish({
    channel: 'Channel-cbotcast',
    message: {
      search: {
        id,
      }
    }
  }, (status, response) => {
    console.log(status, response);
  });

  const hashes = (await Promise.all([
    s3.listObjectsV2({
      Bucket: process.env.BUCKET_NAME,
      // Prefix: `hash/${currMonth}`,
      Prefix: `hash/`,
    }).promise(),
    // s3.listObjectsV2({
    //   Bucket: process.env.BUCKET_NAME,
    //   Prefix: `hash/${prevMonth}`,
    // }).promise(),
  ])).reduce((acc, data) => [...acc, ...data.Contents.map(object => object.Key)], []);

  const batches = hashes.reduce((acc, segment, i) => (i % 10 ? acc[acc.length - 1].push(segment) : acc.push([ segment ])) && acc, []);

  await Promise.all(batches.map(batch => sqs.sendMessageBatch({
    QueueUrl: process.env.SEARCH_QUEUE,
    Entries: batch.map((hash) => {
      return {
        Id: `${id}-${hash.split('/').pop().replace('.pklz', '')}`,
        MessageAttributes: {
          Hash: {
            DataType: 'String',
            StringValue: hash,
          },
          Id: {
            DataType: 'String',
            StringValue: id,
          },
          // Date: {
          //   DataType: 'String',
          //   StringValue: date,
          // },
        },
        MessageBody: hash,
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
