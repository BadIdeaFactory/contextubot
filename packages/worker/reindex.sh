unset SLS_DEBUG 
sls invoke -f create -d '{"channel": "FOXNEWSW", "date": "20181001"}' &
sls invoke -f create -d '{"channel": "FOXNEWSW", "date": "20181002"}' &
sls invoke -f create -d '{"channel": "FOXNEWSW", "date": "20181003"}' &
sls invoke -f create -d '{"channel": "FOXNEWSW", "date": "20181004"}' &
sls invoke -f create -d '{"channel": "FOXNEWSW", "date": "20181005"}' &

sls invoke -f create -d '{"channel": "BBCNEWS", "date": "20181001"}' &
sls invoke -f create -d '{"channel": "BBCNEWS", "date": "20181002"}' &
sls invoke -f create -d '{"channel": "BBCNEWS", "date": "20181003"}' &
sls invoke -f create -d '{"channel": "BBCNEWS", "date": "20181004"}' &
sls invoke -f create -d '{"channel": "BBCNEWS", "date": "20181005"}' &

sls invoke -f create -d '{"channel": "CNNW", "date": "20181001"}' &
sls invoke -f create -d '{"channel": "CNNW", "date": "20181002"}' &
sls invoke -f create -d '{"channel": "CNNW", "date": "20181003"}' &
sls invoke -f create -d '{"channel": "CNNW", "date": "20181004"}' &
sls invoke -f create -d '{"channel": "CNNW", "date": "20181005"}' &

sls invoke -f create -d '{"channel": "MSNBCW", "date": "20181001"}' & 
sls invoke -f create -d '{"channel": "MSNBCW", "date": "20181002"}' &
sls invoke -f create -d '{"channel": "MSNBCW", "date": "20181003"}' &
sls invoke -f create -d '{"channel": "MSNBCW", "date": "20181004"}' &
sls invoke -f create -d '{"channel": "MSNBCW", "date": "20181005"}' &


