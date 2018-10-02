import fs from 'fs';
import { promisify } from 'util';
// import Promise from 'promise';
import axios from 'axios';
import embedly from 'embedly';
import youtubedl from 'youtube-dl';
import ffprobe from 'ffprobe';
import AwsSdk from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import https from 'https';

AWSXRay.captureHTTPsGlobal(https);
AWSXRay.capturePromise();
const AWS = AWSXRay.captureAWS(AwsSdk);

const s3 = new AWS.S3();
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });


export const query = async (event, context, cb) => {

  const data = [ { event } ];
  const { url } = event.queryStringParameters;

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

  const Key = `query/${event.requestContext.requestId}/info.json`;
  await s3.putObject({
    Body: JSON.stringify({ data }),
    ACL: 'public-read',
    Bucket: process.env.BUCKET_NAME,
    Key,
  }).promise();

  await sqs.sendMessage({
    QueueUrl: process.env.EXPORT_QUEUE,
    MessageAttributes: {
      URL: {
        DataType: 'String',
        StringValue: url,
      },
      Key: {
        DataType: 'String',
        StringValue: Key,
      }
    },
    MessageBody: 'test',
  }).promise();

  cb(null, {
    statusCode: 200,
    body: JSON.stringify({ data }),
  });
};