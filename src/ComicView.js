import React, { Component } from 'react';
import { Link } from 'react-router-dom'
//import ReactJson from 'react-json-view';
//import axios from 'axios';
//import isUrl from 'is-url-superb';

//import { Layout, BackTop, Input, Steps, Collapse, Spin, Switch } from 'antd';
import { Layout, BackTop } from 'antd';
//import Button from 'antd/lib/button';

import './App.css';
import './Hyperaudio.css';

const { Content } = Layout;

class ComicView extends Component {

  constructor(props) {
    super(props);
    this.state = { ht: null };
    this.state = { mp4: null };
    this.state = { comicUrl: null };

    this.subsObj = "";

    this.sceneSplits = [];
    this.textSplits = [];
  }

  splitMedia(data) {
    let splitIndex = 0;
    this.textSplits[0] = "...";

    data.forEach(subs => {
      subs.content.forEach((text) => {

        const periodIndex = text.indexOf('. '); // the space is important!
        const commaIndex = text.indexOf(',');
        const qmarkIndex = text.indexOf('?');

        let puncIndex = -1;

        if (qmarkIndex >= 0) {
          puncIndex = qmarkIndex;
        } else if (periodIndex >= 0) {
          puncIndex = periodIndex;
        } else if (commaIndex >= 0) {
          puncIndex = commaIndex;
        }

        if (puncIndex >= 0) {
          this.textSplits[splitIndex] += `${text.substr(0, puncIndex + 1)} `;
          this.sceneSplits[splitIndex] = subs.startSec;
          splitIndex++;
          this.textSplits[splitIndex] = "";
          this.textSplits[splitIndex] += `${text.substr(puncIndex + 1, text.length)} `;
        } else {
          this.textSplits[splitIndex] += `${text} `;
        }
      });
    });
  }

  addFrames(index) {

    console.log("addFrames");

    const video = document.getElementById('video');

    if (index !== null || index !== undefined) {
      index= 0;
    }



    if (index < this.sceneSplits.length) {
      window.setTimeout(() => {
        this.addFrame(video, this.sceneSplits[index], this.textSplits[index]);
        index++;
        this.addFrames(index);
      }, 1000);
    }
    // TODO: use promises instead of timeouts
  }


  getSrt(srtUrl) {


    fetch(srtUrl).then(response => {
      response.text().then(data => {

        let text = data.toString();
        let lines = text.split('\n');

        let output = [];
        let buffer = {
          content: []
        };

        let parts;
        let hms;

        lines.forEach(function(line) {
          if(!buffer.id)
            buffer.id = line;
          else if(!buffer.start) {
            var range = line.split(' --> ');
            buffer.start = range[0];
            buffer.end = range[1];
            parts = range[0].split(',');
            hms = parts[0].split(':');
            buffer.startSec = (parseInt((hms[0] * 60 * 60),10) + parseInt((hms[1] * 60),10) + parseInt(hms[2],10));
            parts = range[1].split(',');
            hms = parts[0].split(':');
            buffer.endSec = (parseInt((hms[0] * 60 * 60),10) + parseInt((hms[1] * 60),10) + parseInt(hms[2],10));
          }
          else if(line !== '')
            buffer.content.push(line+ " "); //mb added space for easier sentence detection versus abbreviations and numbers that tend to occur in the middle of subtitles.
          else {
            output.push(buffer);
            buffer = {
              content: []
            };
          }
        });
        console.log(output);

        this.splitMedia(output);
      });
    });
  }

  componentDidMount() {

    const params = window.location.search.split('/');

    const uid = params[0].slice(1);
    const clipStart = params[1];
    const clipEnd = params[2];
    const clipCc5Start = parseInt(clipStart, 0) + 5; // adding 5 secs to subs as they're usually delayed
    const clipCc5End = parseInt(clipEnd, 0) + 5;

    const mp4Url = "https://api.contextubot.net/proxy?url=https%3A//archive.org/download/"+uid+"/"+uid+".mp4%3Ft%3D"+clipStart+"/"+clipEnd;

    const srtUrl = "https://api.contextubot.net/proxy?url=https%3A//archive.org/download/"+uid+"/"+uid+".cc5.srt%3Ft%3D"+clipCc5Start+"/"+clipCc5End;

    console.log(srtUrl);

    this.setState({ mp4: mp4Url });

    const video = document.getElementById('video');

    video.addEventListener('loadedmetadata', () => {
      console.log('loadedmetadata');

      window.setTimeout(() => {
        console.log(this);
        this.addFrames(0);
      }, 2000)

      // TODO: use promises instead of timeouts
    });

    this.getSrt(srtUrl);
  }

  addFrame(video, seconds, text) {
    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth / 2.1;
    canvas.height = video.videoHeight / 2.1;

    const div = document.createElement("div");

    div.appendChild(canvas);
    const textNode = document.createTextNode(text);
    div.appendChild(textNode);
    div.style.width = "300px";
    div.style.height = "240px";
    div.style.padding = "8px";
    div.style.marginBottom = "48px";
    div.style.float = "left";
    document.getElementById('frames').appendChild(div);
    const ctx = canvas.getContext("2d");
    video.currentTime = seconds;

    console.log("seconds");
    console.log(seconds);

    video.addEventListener('timeupdate', function() {

      console.log("adding images ...");

      ctx.drawImage(video, 0, 0, video.videoWidth / 2.1, video.videoHeight / 2.1);

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      let filtered = window.ImageFilters.Oil (imageData, 1, 32);

      // put it back into a context to view the results

      ctx.putImageData(filtered, 0, 0);

    });
  }


  render() {

    return (
      <Layout className="layout">
        <BackTop />
        <Content>
          <div className="container">

            <div style={{display: 'none'}} className="span12">
              <div>
                <video id="video" crossOrigin="anonymous" width="320" src={this.state.mp4}>
                </video>
              </div>
            </div>

            <div className="span12">
              <div>
                <h2>Comic View</h2>
              </div>
            </div>

            <div className="row">
              <div id="frames">
              </div>
            </div>

          </div>
        </Content>
      </Layout>
    );
  }
}

export default ComicView;
