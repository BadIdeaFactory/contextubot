import fs from 'fs';
import { promisify } from 'util';
import youtubedl from 'youtube-dl';
import AwsSdk from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import https from 'https';

AWSXRay.captureHTTPsGlobal(https);
AWSXRay.capturePromise();
const AWS = AWSXRay.captureAWS(AwsSdk);

const s3 = new AWS.S3();


export const audio = async (event, context, cb) => {
  // console.log(JSON.stringify(event));
  if (!event.Records[0].s3) return cb(null, { event });

  const input = JSON.parse((await s3.getObject({
    Bucket: process.env.BUCKET_NAME,
    Key: event.Records[0].s3.object.key
  }).promise()).Body);

  const id = input.data[0].event.requestContext.requestId;

  const output = await promisify(youtubedl.exec)(input.data[0].event.queryStringParameters.url, [
    '--no-check-certificate',
    '--no-cache-dir',
    '--format=bestaudio/best',
    '--extract-audio',
    '--prefer-ffmpeg',
    `--ffmpeg-location=${process.cwd()}/ffmpeg`,
    '--audio-format=wav',
    `--output=/tmp/${id}.%(ext)s`,
  ], {
    cwd: '/tmp',
  });

  await s3.putObject({
    Body: JSON.stringify({ input, event, output }),
    ACL: 'public-read',
    Bucket: process.env.BUCKET_NAME,
    Key: `wave/${id}/info.json`,
  }).promise();

  const fileStream = fs.createReadStream(`/tmp/${id}.wav`);
  await s3.putObject({
    Body: fileStream,
    ACL: 'public-read',
    Bucket: process.env.BUCKET_NAME,
    Key: `wave/${id}/audio.wav`,
  }).promise();

  cb(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: output,
      input: event,
    }),
  });
};
