# from __future__ import print_function
import warnings
with warnings.catch_warnings():
    warnings.simplefilter('ignore')

try:
    import unzip_requirements
except ImportError:
    pass

try:
    import subprocess
except:
    pass

import os
import sys
import json
from datetime import date, timedelta

import boto3
import botocore

from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

import numpy as np

import audfprint_match
import audfprint_analyze
import hash_table

try:
    from aws_xray_sdk.core import xray_recorder
    from aws_xray_sdk.core import patch_all
    patch_all()
except:
    pass

s3 = boto3.resource('s3')
s3client = boto3.client('s3')
BUCKET_NAME = os.environ['BUCKET_NAME']

pnconfig = PNConfiguration()
pnconfig.subscribe_key = os.environ['PUBNUB_SUB']
pnconfig.publish_key = os.environ['PUBNUB_PUB']
pnconfig.ssl = False

pubnub = PubNub(pnconfig)


def fingerprint(event, context):
    if event.get('Event') == 's3:TestEvent':
        return

    key = os.environ.get('S3_OBJECT_KEY')
    if not key:
        key = event['Records'][0]['s3']['object']['key']

    id = key.split('/')[1]
    s3.Bucket(BUCKET_NAME).download_file(key, '/tmp/{}.wav'.format(id))

    # analyzer = audfprint_analyze.Analyzer()
    # analyzer.n_fft = 512
    # analyzer.n_hop = analyzer.n_fft/2
    # analyzer.shifts = 1
    # # analyzer.exact_count = True
    # analyzer.density = 20.0
    # analyzer.target_sr = 11025
    # analyzer.verbose = False

    # saver = audfprint_analyze.hashes_save
    # output = analyzer.wavfile2hashes('/tmp/{}.wav'.format(id))
    # saver('/tmp/{}.afpt'.format(id), output)

    subprocess.run(['python', 'audfprint/audfprint.py', 'precompute', '--samplerate=11025', '--density=20', '--shifts=1', '/tmp/{}.wav'.format(id)])

    s3.Bucket(BUCKET_NAME).upload_file('./tmp/{}.afpt'.format(id), key.replace('.wav', '.afpt'))

    body = {
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    pubnub.publish().channel('Channel-cbotcast').message({ 'fingerprint': id }).pn_async(publish_callback)
    pubnub.publish().channel(id).message({ 'fingerprint': id }).pn_async(publish_callback)

    return response


def create(event, context):
    day = (date.today() - timedelta(2)).strftime('%Y%m%d')
    channel = event['channel']

    analyzer = audfprint_analyze.Analyzer()
    analyzer.n_fft = 512
    analyzer.n_hop = analyzer.n_fft/2
    analyzer.shifts = 1
    # analyzer.exact_count = True
    analyzer.density = 20.0
    analyzer.target_sr = 11025
    analyzer.verbose = False

    # hashbits=20, depth=100, maxtime=16384
    hash_tab = hash_table.HashTable(hashbits=20, depth=100, maxtime=262144)
    hash_tab.params['samplerate'] = analyzer.target_sr

    fingerprints = s3client.list_objects_v2(Bucket=BUCKET_NAME, Prefix='tva/{}/{}/'.format(day, channel))['Contents']

    for fingerprint in fingerprints:
        s3.Bucket(BUCKET_NAME).download_file(fingerprint['Key'], '/tmp/{}'.format(fingerprint['Key'].split('/').pop()))
        analyzer.ingest(hash_tab, '/tmp/{}'.format(fingerprint['Key'].split('/').pop()))
        os.remove('/tmp/{}'.format(fingerprint['Key'].split('/').pop()))

    if hash_tab and hash_tab.dirty:
        hash_tab.save('/tmp/{}-{}.pklz'.format(channel, day))

    s3.Bucket(BUCKET_NAME).upload_file('/tmp/{}-{}.pklz'.format(channel, day), 'hash/{}/{}-{}.pklz'.format(day, channel, day))

    body = {
        "input": event,
        "fingerprints": len(fingerprints)
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }
    return response


def match(event, context):
    hash = event['Records'][0]['body']
    id = event['Records'][0]['messageAttributes']['Id']['stringValue']

    s3.Bucket(BUCKET_NAME).download_file('wave/{}/audio.afpt'.format(id), '/tmp/{}.afpt'.format(id))
    s3.Bucket(BUCKET_NAME).download_file(hash, '/tmp/{}'.format(hash.split('/').pop()))

    qry = '/tmp/{}.afpt'.format(id)
    hashFile = '/tmp/{}'.format(hash.split('/').pop())

    matcher = audfprint_match.Matcher()
    matcher.find_time_range = True
    matcher.verbose = False
    matcher.max_returns = 100

    matcher.exact_count = True
    matcher.max_alignments_per_id = 20

    analyzer = audfprint_analyze.Analyzer()
    analyzer.n_fft = 512
    analyzer.n_hop = analyzer.n_fft/2
    analyzer.shifts = 1
    # analyzer.exact_count = True
    analyzer.density = 20.0
    analyzer.target_sr = 11025
    analyzer.verbose = False

    hash_tab = hash_table.HashTable(hashFile)
    hash_tab.params['samplerate'] = analyzer.target_sr

    rslts, dur, nhash = matcher.match_file(analyzer, hash_tab, qry, 0)
    t_hop = analyzer.n_hop / float(analyzer.target_sr)
    qrymsg = qry + (' %.1f ' % dur) + "sec " + str(nhash) + " raw hashes"

    # print "duration,start,from,time,source,sourceId,nhashaligned,aligntime,nhashraw,rank,min_time,max_time, t_hop"
    matches = []
    if len(rslts) == 0:
        nhashaligned = 0
    else:
        for (tophitid, nhashaligned, aligntime, nhashraw, rank, min_time, max_time) in rslts:
                msg = ("{:f},{:f},{:s},{:f},{:s},{:n},{:n},{:n},{:n},{:n},{:n},{:n},{:f}").format(
                        (max_time - min_time) * t_hop, min_time * t_hop, qry,
                        (min_time + aligntime) * t_hop, hash_tab.names[tophitid], tophitid, nhashaligned, aligntime, nhashraw, rank, min_time, max_time, t_hop)
                print(msg)
                duration = (max_time - min_time) * t_hop
                start = min_time * t_hop
                time = (min_time + aligntime) * t_hop
                matches.append({
                    'duration': np.asscalar(duration) if isinstance(duration, np.generic) else duration,
                    'start': np.asscalar(start) if isinstance(start, np.generic) else start,
                    'time': np.asscalar(time) if isinstance(time, np.generic) else time,
                    'match': hash_tab.names[tophitid].split('/').pop().replace('.afpt', ''),
                    'alignedHashes': np.asscalar(nhashaligned) if isinstance(nhashaligned, np.generic) else nhashaligned,
                    'totalHashes': np.asscalar(nhashraw) if isinstance(nhashraw, np.generic) else nhashraw,
                    'rank': np.asscalar(rank) if isinstance(rank, np.generic) else rank
                })

    data = { 'id': id, 'matches': matches, 'hash': hash }

    pubnub.publish().channel('Channel-cbotcast').message(data).pn_async(publish_callback)
    pubnub.publish().channel(id).message(data).pn_async(publish_callback)

    if len(matches) > 0:
        s3.Object(BUCKET_NAME, 'query/{}/{}.json'.format(id, hash.split('/').pop().replace('.pklz', ''))).put(Body=(bytes(json.dumps(data, indent=2).encode('UTF-8'))))

    response = {
        "statusCode": 200,
        # "body": json.dumps(matches),
        "event": event
    }
    return response

def publish_callback(result, status):
    pass

# def lambda_test(event, context):
#     for arg in sys.argv:
#         print(arg)
#     print(os.getcwd())
#     print(os.path.basename(__file__))
#     for key in os.environ.keys():
#         print('{0}={1}'.format(key,os.environ[key]))
#     print(os.getuid())
#     print(os.getgid())
#     print(os.geteuid())
#     print(os.getegid())
#     print(os.getgroups())
#     print(os.umask(0o222))

#     print(event)
#     print(context.get_remaining_time_in_millis())
#     print(context.aws_request_id)
#     if context.client_context:
#         print(context.client_context)
#     print(context.function_name)
#     print(context.function_version)
#     print(context.identity.cognito_identity_id)
#     print(context.identity.cognito_identity_pool_id)
#     print(context.invoked_function_arn)
#     print(context.log('Log this for me please'))
#     print(context.log_group_name)
#     print(context.log_stream_name)
#     print(context.memory_limit_in_mb)

#     return 'It works!'
