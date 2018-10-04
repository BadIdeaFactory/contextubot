FROM lambci/lambda:build-python3.6

RUN pip install --upgrade pip setuptools && \
    pip install numpy && \
    pip install scipy && \
    pip install matplotlib && \
    pip install docopt && \
    pip install git+git://github.com/bmcfee/librosa.git && \
    pip install joblib && \
    pip install psutil

WORKDIR /var/task

RUN curl http://www.mega-nerd.com/SRC/libsamplerate-0.1.8.tar.gz --output - | tar xvz && \
    cd libsamplerate-0.1.8 && ./configure && make && make install && \
    pip install scikits.samplerate

RUN pip install boto3 && \
    pip install botocore && \
    pip install aws_xray_sdk && \
    pip install pubnub


RUN git clone https://github.com/dpwe/audfprint.git

ADD . /var/task
RUN mv ./ffmpeg/ffmpeg /usr/local/bin/

# ENTRYPOINT ["/var/lang/bin/python3.6", "-c", "import lambda_function; lambda_function.lambda_handler({}, {})"]
# ENTRYPOINT ["/var/lang/bin/python3.6", "-c", "import handler; handler.fingerprint({}, {})"]

RUN rm -fr audfprint/.git && rm -f libsamplerate-0.1.8.tar.gz && rm -fr libsamplerate-0.1.8 \
    rm -r /root/.cache