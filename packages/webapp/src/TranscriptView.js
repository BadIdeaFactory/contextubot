import styled from 'styled-components';
import React, { Component } from 'react';
//import ReactJson from 'react-json-view';
//import axios from 'axios';
//import isUrl from 'is-url-superb';

import './App.css';
import './Hyperaudio.css';

import { Container, Content, Hint, Icon, Separator, Tabs, Tab } from './ui';
import {} from './ui/utils';

const ThisContent = styled(Content)`
  padding-top: 2px;
  & video {
    height: 100% !important;
    width: 100% !important;
  }
`;

class TranscriptView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comicUrl: '',
      ht: null,
      mp4: null
    };
  }

  getTranscript(srtUrl) {
    var transData;

    fetch(srtUrl).then(response => {
      response.text().then(data => {
        // ===== NOTE =====
        // 2800 is a frig factor just to sync the subtitles to video.
        // This figure may or may not work on other clips.
        // I'm not sure how we get around this without aligning.

        if (data) {
          transData = this.srtToHypertranscript(data, 2800);
          this.setState({ ht: transData });
          window.hyperaudiolite.init('hypertranscript', 'video', false);
        } else {
          this.setState({ ht: 'no transcript associated with this video' });
        }
      });
    });
  }

  srtToHypertranscript(data, ccdelay) {
    var i = 0,
      len = 0,
      idx = 0,
      lines,
      time,
      text,
      sub;

    var paraSplitTime = 0.1;

    // Simple function to convert HH:MM:SS,MMM or HH:MM:SS.MMM to SS.MMM
    // Assume valid, returns 0 on error

    var toSeconds = function(t_in) {
      var t = t_in.split(':');

      try {
        var s = t[2].split(',');

        // Just in case a . is decimal seperator
        if (s.length === 1) {
          s = t[2].split('.');
        }

        return (
          parseFloat(t[0], 10) * 3600 +
          parseFloat(t[1], 10) * 60 +
          parseFloat(s[0], 10) +
          parseFloat(s[1], 10) / 1000
        );
      } catch (e) {
        return 0;
      }
    };

    var outputString =
      '<article><header></header><section><header></header><p>';
    var lineBreaks = true;
    var paraPunct = true;
    var ltime = 0;
    var ltext;

    // Here is where the magic happens
    // Split on line breaks
    lines = data.split(/(?:\r\n|\r|\n)/gm);
    len = lines.length;

    for (i = 0; i < len; i++) {
      sub = {};
      text = [];

      sub.id = parseInt(lines[i++], 10);

      // Split on '-->' delimiter, trimming spaces as well

      try {
        time = lines[i++].split(/[\t ]*-->[\t ]*/);
      } catch (e) {
        alert('Warning. Possible issue on line ' + i + ": '" + lines[i] + "'.");
        break;
      }

      sub.start = toSeconds(time[0]);

      // So as to trim positioning information from end
      if (!time[1]) {
        alert('Warning. Issue on line ' + i + ": '" + lines[i] + "'.");
        return;
      }

      idx = time[1].indexOf(' ');
      if (idx !== -1) {
        time[1] = time[1].substr(0, idx);
      }
      sub.end = toSeconds(time[1]);

      // Build single line of text from multi-line subtitle in file
      while (i < len && lines[i]) {
        text.push(lines[i++]);
      }

      // Join into 1 line, SSA-style linebreaks
      // Strip out other SSA-style tags
      sub.text = text
        .join('\\N')
        .replace(/\{(\\[\w]+\(?([\w\d]+,?)+\)?)+\}/gi, '');

      // Escape HTML entities
      sub.text = sub.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

      // Unescape great than and less than when it makes a valid html tag of a supported style (font, b, u, s, i)
      // Modified version of regex from Phil Haack's blog: http://haacked.com/archive/2004/10/25/usingregularexpressionstomatchhtml.aspx
      // Later modified by kev: http://kevin.deldycke.com/2007/03/ultimate-regular-expression-for-html-tag-parsing-with-php/
      sub.text = sub.text.replace(
        /&lt;(\/?(font|b|u|i|s))((\s+(\w|\w[\w-]*\w)(\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)(\/?)&gt;/gi,
        '<$1$3$7>'
      );
      //sub.text = sub.text.replace( /\\N/gi, "<br />" );
      sub.text = sub.text.replace(/\\N/gi, ' ');

      var wordLengthSplit = true;

      // enhancements to take account of word length

      var swords = sub.text.split(' ');
      var sduration = sub.end - sub.start;
      var stimeStep = sduration / swords.length;

      // determine length of words

      var swordLengths = [];

      var totalLetters = 0;
      var si;
      var sl;

      for (si = 0, sl = swords.length; si < sl; ++si) {
        totalLetters = totalLetters + swords[si].length;
        swordLengths[si] = swords[si].length;
      }

      var letterTime = sduration / totalLetters;
      var wordStart = 0;

      for (si = 0, sl = swords.length; si < sl; ++si) {
        var wordTime = swordLengths[si] * letterTime;
        var stime;
        if (wordLengthSplit) {
          stime = Math.round((sub.start + si * stimeStep) * 1000);
        } else {
          stime = Math.round((wordStart + sub.start) * 1000);
        }

        wordStart = wordStart + wordTime;
        var stext = swords[si];
        //var ssafeText = stext.replace('"', '\\"');
        //outputString += '<span m="'+stime+'" oval="'+ssafeText+'">'+stext+'</span> '+'\n';

        /*console.log("stime");
        console.log(stime);
        console.log("ltime");
        console.log(ltime);
        console.log("diff");
        console.log(stime - ltime);
        console.log(ltext);*/

        if (stime - ltime > paraSplitTime * 1000 && paraSplitTime > 0) {
          //console.log("fullstop? "+stext+" - "+stext.indexOf("."));
          var punctPresent =
            ltext &&
            (ltext.indexOf('.') > 0 ||
              ltext.indexOf('?') > 0 ||
              ltext.indexOf('!') > 0);
          if (!paraPunct || (paraPunct && punctPresent)) {
            outputString += '</p><p>';
          }
        }

        outputString +=
          '<span data-m="' + (stime + ccdelay) + '">' + stext + ' </span>';

        ltime = stime;
        ltext = stext;

        if (lineBreaks) outputString = outputString + '\n';
      }
    }
    return (
      outputString +
      '</p><footer></footer></section></footer></footer></article>'
    );
  }

  componentDidMount() {
    this.setState({ ht: 'loading...' });

    const params = window.location.search.split('/');

    const uid = params[0].slice(1);
    const clipStart = params[1];
    const clipEnd = params[2];
    const clipCc5Start = parseInt(clipStart, 0) + 5; // adding 5 secs to subs as they're usually delayed
    const clipCc5End = parseInt(clipEnd, 0) + 5;

    const mp4Url =
      'https://proxy.contextubot.net/proxy?url=https%3A//archive.org/download/' +
      uid +
      '/' +
      uid +
      '.mp4%3Ft%3D' +
      clipStart +
      '/' +
      clipEnd;

    const srtUrl =
      'https://proxy.contextubot.net/proxy?url=https%3A//archive.org/download/' +
      uid +
      '/' +
      uid +
      '.cc5.srt%3Ft%3D' +
      clipCc5Start +
      '/' +
      clipCc5End;

    console.log(srtUrl);
    const comicUrl = '/ComicView/?' + uid + '/' + clipStart + '/' + clipEnd;

    this.setState({ comicUrl: comicUrl });

    this.setState({ mp4: mp4Url });
    this.getTranscript(srtUrl);
  }

  render() {
    // Probably want to move this const into componentDidMount

    const comicUrl = this.state.comicUrl; // + "";

    // no idea why I have to append a blank string to the comicUrl
    // but it avoids a number of bizarre router errors.

    return (
      <ThisContent>
        <Container limit="m">
          <Tabs>
            <Tab active>
              <Icon name="transcript" size="x" /> Interactive Transcript
            </Tab>
            <Tab onClick={() => this.props.history.push(comicUrl)}>
              <Icon name="storyboard" size="x" /> Captioned Storyboard
            </Tab>
          </Tabs>
          <Container fill="white" padded>
            <video
              controls
              crossOrigin="anonymous"
              id="video"
              src={this.state.mp4}
              width="640"
            />
            <Separator silent size="x" />
            <Hint>
              <Icon name="info" size="x" /> Click on words to navigate, select
              text to tweet
            </Hint>
            <Separator silent size="x" />
            <div
              id="hypertranscript"
              dangerouslySetInnerHTML={{ __html: this.state.ht }}
            />
          </Container>
        </Container>
      </ThisContent>
    );
  }
}

export default TranscriptView;
