FROM bitnami/python:3.6-debian-9


RUN pip install --upgrade pip && \
    pip install setuptools && \
    pip install numpy && \
    pip install scipy && \
    pip install matplotlib && \
    pip install docopt && \
    pip install joblib && \
    pip install psutil

RUN pip install git+git://github.com/bmcfee/librosa.git

RUN pip install boto3 && \
    pip install botocore && \
    # pip install aws_xray_sdk && \
    pip install pubnub && \
    pip install Flask


WORKDIR /var/task

RUN curl http://www.mega-nerd.com/SRC/libsamplerate-0.1.8.tar.gz --output - | tar xvz && \
    cd libsamplerate-0.1.8 && ./configure && make && make install && \
    pip install scikits.samplerate

RUN git clone https://github.com/dpwe/audfprint.git

ADD . /var/task
RUN mv ./ffmpeg/ffmpeg /usr/local/bin/

EXPOSE 8000
ENV FLASK_APP application.py
ENV FLASK_RUN_PORT 8000
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8

ENTRYPOINT ["python", "-m",  "flask", "run", "--host=0.0.0.0"]

RUN rm -fr audfprint/.git && \
    rm -f libsamplerate-0.1.8.tar.gz && \
    rm -fr libsamplerate-0.1.8 && \
    rm -r /root/.cache && \
    rm -rf /var/lib/apt/lists/*
