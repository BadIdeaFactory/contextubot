import warnings
with warnings.catch_warnings():
    warnings.simplefilter('ignore')

try:
    import unzip_requirements
except ImportError:
    pass

import os
import sys
import json
from datetime import date, timedelta

import boto3
import botocore
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.core import patch_all

import numpy as np

import audfprint_match
import audfprint_analyze
import hash_table

patch_all()

s3 = boto3.resource('s3')
s3client = boto3.client('s3')
BUCKET_NAME = os.environ['BUCKET_NAME']


def fingerprint(event, context):
    print(event)

    body = {
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }
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
    s3.Bucket(BUCKET_NAME).download_file('_test-fprint.afpt', '/tmp/_test-fprint.afpt')
    s3.Bucket(BUCKET_NAME).download_file('_test-db.pklz', '/tmp/_test-db.pklz')

    qry = '/tmp/_test-fprint.afpt'
    hashFile = '/tmp/_test-db.pklz'

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
                matches.append(msg)

    response = {
        "statusCode": 200,
        "body": json.dumps(matches)
    }
    return response
