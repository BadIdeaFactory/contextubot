import fs from 'fs';
import { promisify } from 'util';
// import Promise from 'promise';
import request from 'requisition';
import embedly from 'embedly';
import youtubedl from 'youtube-dl';
import ffprobe from 'ffprobe';
import AwsSdk from 'aws-sdk';
import awsXRay from 'aws-xray-sdk';

const AWS = awsXRay.captureAWS(AwsSdk);
const s3 = new AWS.S3();


export const query = async (event, context, cb) => {
  const data = [ { event } ];
  const errors = [];

  const { url } = event.queryStringParameters;

  const { headers } = await request['head'](url);
  data.push({ headers });

  if (headers && headers['content-type'] && headers['content-type'].startsWith('text/html')) {
    try {
      data.push({
        oembed: await promisify(new embedly({ key: process.env.EMBEDLY_KEY }).oembed)({ url }),
      });
    } catch (e) { errors.push(e); }

    try {
      data.push({
        info: await promisify(youtubedl.getInfo)(url, [
          // '--verbose',
          '--no-check-certificate',
          '--no-cache-dir',
        ], {
          cwd: '/tmp',
        }),
      });
    } catch (e) { errors.push(e); }
  } else {
    try {
      data.push({
        media: await ffprobe(url, { path: `${process.cwd()}/ffmpeg/ffprobe` }),
      });
    } catch (e) { errors.push(e); }
  }

  await s3.putObject({
    Body: JSON.stringify({ data, errors }),
    ACL: 'public-read',
    Bucket: process.env.BUCKET_NAME,
    Key: `query/${event.requestContext.requestId}/info.json`,
  }).promise();

  cb(null, {
    statusCode: 200,
    body: JSON.stringify({ data, errors }),
  });
};
