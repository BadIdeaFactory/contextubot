docker-build:
	 docker build audfprint -t contextubot-audfprint

docker-run:
	# docker run --env-file ~/.aws/contextubot_docker_credentials contextubot-audfprint python -c 'import handler; handler.fingerprint({ "Records": [{ "s3": { "object": { "key": "wave/0a66a2c7-c6ec-11e8-8e13-f166c7867481/audio.wav" } } }] }, {})'
	docker run --env-file ~/.aws/contextubot_docker_credentials contextubot-audfprint python -c 'import handler; handler.fingerprint({}, {})'
		