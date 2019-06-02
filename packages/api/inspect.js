import fs from 'fs';
import { promisify } from 'util';
import axios from 'axios';
import embedly from 'embedly';
import youtubedl from 'youtube-dl';
import ffprobe from 'ffprobe';
import AwsSdk from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import https from 'https';
import PubNub from 'pubnub';

AWSXRay.captureHTTPsGlobal(https);
AWSXRay.capturePromise();
const AWS = AWSXRay.captureAWS(AwsSdk);

const s3 = new AWS.S3();
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUB,
  subscribeKey: process.env.PUBNUB_SUB,
});


export const query = async (event, context, cb) => {

  const data = [ { event } ];
  const { url } = event.queryStringParameters;
  const today = dateParts(new Date()).slice(0,3).join('');

  pubnub.publish({
    channel: event.requestContext.requestId,
    message: {
      query: {
        url,
        id: event.requestContext.requestId
      }
    }
  }, (status, response) => {
    console.log(status, response);
  });

  const { headers } = await axios.head(url);
  data.push({ headers });

  if (headers && headers['content-type'] && headers['content-type'].startsWith('text/html')) {
    try {
      data.push({
        oembed: await promisify(new embedly({ key: process.env.EMBEDLY_KEY }).oembed)({ url }),
      });
    } catch (ignored) { }

    try {
      data.push({
        info: await promisify(youtubedl.getInfo)(url, [
          '--no-check-certificate',
          '--no-cache-dir',
        ], {
          cwd: '/tmp',
        }),
      });
    } catch (ignored) { }
  } else {
    try {
      data.push({
        media: await ffprobe(url, { path: `${process.cwd()}/ffmpeg/ffprobe` }),
      });
    } catch (ignored) { }
  }

  const Key = `query/${today}/${event.requestContext.requestId}/info.json`;
  await s3.putObject({
    Body: JSON.stringify({ data }),
    ACL: 'public-read',
    Bucket: process.env.BUCKET_NAME,
    Key,
  }).promise();

  pubnub.publish({
    channel: 'Channel-cbotcast',
    message: {
      query: {
        url,
        id: event.requestContext.requestId
      }
    }
  }, (status, response) => {
    console.log(status, response);
  })

  // await sqs.sendMessage({
  //   QueueUrl: process.env.EXPORT_QUEUE,
  //   MessageAttributes: {
  //     URL: {
  //       DataType: 'String',
  //       StringValue: url,
  //     },
  //     Key: {
  //       DataType: 'String',
  //       StringValue: Key,
  //     }
  //   },
  //   MessageBody: 'test',
  // }).promise();

  cb(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ data }),
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
