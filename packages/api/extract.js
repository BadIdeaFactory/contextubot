import fs from 'fs';
import { promisify } from 'util';
// import Promise from 'promise';
import AWS from 'aws-sdk';
import youtubedl from 'youtube-dl';


const s3 = new AWS.S3();


export const hello = async (event, context, cb) => {
  const output = await promisify(youtubedl.exec)('http://www.youtube.com/watch?v=90AiXO1pAiA', [
    '--verbose',
    '--no-check-certificate',
    '--format=bestaudio/best',
    '--extract-audio',
    '--prefer-ffmpeg',
    `--ffmpeg-location=${process.cwd()}/ffmpeg`,
    '--audio-format=wav',
    '--output=/tmp/%(id)s.%(ext)s',
  ], {
    cwd: '/tmp',
  });

  /*, (err, output) => {
    if (output) console.log(output.join('\n'));
    if (err) console.log(err);

    cb(err, {
      statusCode: 200,
      body: JSON.stringify({
        message: output,
        input: event,
      }),
    });
  }*/

  cb(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: output,
      input: event,
    }),
  });
};
