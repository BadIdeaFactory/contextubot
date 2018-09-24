from __future__ import unicode_literals

# try:
#     import unzip_requirements
# except ImportError:
#     pass

import os
import json
import youtube_dl

# os.environ['PATH'] = os.environ['PATH'] + ':' + os.environ['LAMBDA_TASK_ROOT'] + '/ffmpeg'

def progressHook(d):
    if d['status'] == 'finished':
        print('Done downloading, now converting ...')

ydl_opts = {
    # 'ffmpeg_location': os.environ['LAMBDA_TASK_ROOT'] + '/ffmpeg',
    'prefer_ffmpeg': True,
    'outtmpl': '/tmp/%(id)s.%(ext)s',
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'wav' # pcm_s16le
    }],
    'progress_hooks': [progressHook]
}

def extract(event, context):
    print(os.environ['PATH'])

    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download(['https://www.youtube.com/watch?v=BaW_jenozKc'])

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response