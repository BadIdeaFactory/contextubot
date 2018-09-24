try:
    import unzip_requirements
except ImportError:
    pass

import os
import sys
import json
import boto3
import botocore

import numpy as np

import audfprint_match
import audfprint_analyze
import hash_table

s3 = boto3.resource('s3')
BUCKET_NAME = os.environ['BUCKET_NAME']


def create(event, context):
    s3.Bucket(BUCKET_NAME).download_file('_test-fprint.afpt', '/tmp/_test-fprint.afpt')

    analyzer = audfprint_analyze.Analyzer()
    analyzer.n_fft = 512
    analyzer.n_hop = analyzer.n_fft/2
    analyzer.shifts = 1
    # analyzer.exact_count = True
    analyzer.density = 20.0
    analyzer.target_sr = 11025
    analyzer.verbose = False

    # hashbits=20, depth=100, maxtime=16384
    hash_tab = hash_table.HashTable(
                    hashbits=20,
                    depth=100,
                    maxtime=16384)
    hash_tab.params['samplerate'] = analyzer.target_sr

    analyzer.ingest(hash_tab, '/tmp/_test-fprint.afpt')
            
    if hash_tab and hash_tab.dirty:
        hash_tab.save('/tmp/_test-db.pklz')

    s3.Bucket(BUCKET_NAME).upload_file('/tmp/_test-db.pklz', '_test-db.pklz')

    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
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
