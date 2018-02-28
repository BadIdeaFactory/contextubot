import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import axios from 'axios';
import isUrl from 'is-url-superb';

import { Layout, BackTop, Input, Steps, Collapse, Spin } from 'antd';
import Button from 'antd/lib/button';

import './App.css';

const { Content } = Layout;
const Search = Input.Search;
const Step = Steps.Step;
const Panel = Collapse.Panel;

let API = 'https://api.contextubot.net';
if (document.location.hostname === '127.0.0.1.xip.io')
  API = 'http://localhost:8080';
if (document.location.hostname === 'eb.127.0.0.1.xip.io')
  API = 'http://contextubot-dev-api.us-east-1.elasticbeanstalk.com';

class SearchMedia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      status: 'wait',
      step0: '',
      step1: '',
      step2: '',
      step3: '',
      data: {},
      preview: false
    };
  }

  handleChange(event) {
    if (event.target.value === '') {
      this.setState({
        status: 'wait',
        step0: '',
        step1: '',
        step2: '',
        step3: '',
        data: {},
        step: 0
      });
    }
  }

  handleSearch(value) {
    if (!isUrl(value)) {
      this.setState({
        status: 'error',
        step0: 'invalid link'
      });
      return;
    }

    this.setState({
      data: {},
      step: 0,
      step0: '',
      step1: '',
      step2: '',
      step3: '',
      status: 'process'
    });

    axios
      .post(`${API}?url=${encodeURIComponent(value.trim())}`)
      .then(({ data }) => {
        console.log(data);
        this.setState({
          data,
          status: 'finish'
        });

        if (data.headers) {
          this.setState({
            step0: data.headers['content-type']
          });
        }

        // media?
        if (data.info) {
          this.setState({
            step: 1,
            status: 'finish',
            step1: data.info.extractor
          });
        } else if (data.file) {
          this.setState({
            step: 1,
            status: 'finish',
            step1: `${data.file.streams.length} streams`
          });
        }

        // fingerprint?
        if (data.fingerprint) {
          this.setState({
            step: 2,
            status: 'finish',
            step2: (
              <a href={data.fingerprint}>
                <Button
                  type="dashed"
                  icon="download"
                  size="small"
                  style={{ marginTop: 10 }}
                >
                  Download
                </Button>
              </a>
            )
          });
        }

        // matches?
        if (data.matches) {
          this.setState({
            step: 3,
            status: 'finish'
          });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          status: 'error',
          step0: error.message
        });
      });
  }

  renderTitle() {
    if (!this.state.data.info) return null;
    return (
      <div
        style={{
          padding: 16,
          width: 480,
          fontWeight: '600',
          fontSize: 24
        }}
      >
        <span>{this.state.data.info.title}</span>
      </div>
    );
  }

  renderThumbnail() {
    if (!this.state.data.embed) return null;
    return (
      <div
        style={{
          padding: 16
        }}
      >
        <img alt="thumbnail" src={this.state.data.embed[0].thumbnail_url} />
      </div>
    );
  }

  renderDescription() {
    if (!this.state.data.embed) return null;
    return (
      <div
        style={{
          padding: 16,
          width: 480
        }}
      >
        <span>{this.state.data.embed[0].description}</span>
      </div>
    );
  }

  renderViewCount() {
    if (!this.state.data.info) return null;
    return (
      <div
        style={{
          padding: 16,
          width: 480,
          fontWeight: '600'
        }}
      >
        <span>
          Views :{' '}
          {new Intl.NumberFormat().format(this.state.data.info.view_count)}
        </span>
      </div>
    );
  }

  renderHeaders() {
    if (!this.state.data.headers) return null;
    return (
      <Panel header="HTTP Headers" key="1">
        <ReactJson name="headers" src={this.state.data.headers} />
      </Panel>
    );
  }

  renderEmbed() {
    if (!this.state.data.embed) return null;
    return (
      <Panel header="Embed" key="2">
        <ReactJson name="embed" src={this.state.data.embed} />
      </Panel>
    );
  }

  renderInfo() {
    if (!this.state.data.info) return null;
    return (
      <Panel header="Media Options" key="3">
        <ReactJson name="info" src={this.state.data.info} />
      </Panel>
    );
  }

  renderFile() {
    if (!this.state.data.file) return null;
    return (
      <Panel header="Media Info" key="4">
        <ReactJson name="file" src={this.state.data.file} />
      </Panel>
    );
  }

  renderFingerprint() {
    if (!this.state.data.fingerprint) return null;
    return (
      <Panel header="Fingerprint" key="5">
        {this.state.data.fingerprint ? (
          <a href={this.state.data.fingerprint}>
            <Button type="primary" icon="download">
              Download
            </Button>
          </a>
        ) : null}
      </Panel>
    );
  }

  renderMatches() {
    if (!this.state.data.matches) return null;
    return (
      <Panel header="Matches" key="6">
        <ReactJson name="matches" src={this.state.data.matches} />
      </Panel>
    );
  }

  renderErrors() {
    if (!this.state.data.errors) return null;
    const filteredArr = this.state.data.errors.filter(err => {
      return Object.keys(err).length;
    });

    return (
      <Panel
        header={`Errors${filteredArr ? ': ' + filteredArr.length : ''}`}
        key="X"
      >
        <ReactJson name="errors" src={filteredArr} />
      </Panel>
    );
  }

  renderWrappedResults() {
    if (!this.state.data.matches) return null;
    return (
      <Panel header="Results" key="7">
        {this.renderResults()}
      </Panel>
    );
  }

  renderResult(match) {
    if (match.duration === 0) return null;

    const uid = match.source.replace('.afpt', '').replace('_tva', '');
    const clipStart = match.time;
    const clipEnd = match.time + match.duration;
    const mp4Url = `https://archive.org/download/${uid}/${uid}.mp4?t=${clipStart}/${clipEnd}`;
    const comicUrl = `TranscriptView?${uid}/${clipStart}/${clipEnd}`;

    return (
      <div className="video-hldr" key={mp4Url}>
        <span>
          {uid.replace(/_/g, ' ')} ({match.duration}s)
        </span>
        <video className="video" width="300" height="254" controls>
          <source src={mp4Url} />
        </video>
        <span>
          <Link to={comicUrl}>transcriptview </Link>
        </span>
      </div>
    );
  }

  renderResults() {
    if (!this.state.data.fingerprint) return null;

    return <div>{this.state.data.matches.map(this.renderResult)}</div>;
  }

  renderCollapse() {
    if (Object.keys(this.state.data).length === 0) return null;
    return (
      <Collapse style={{ marginTop: 14 }}>
        {this.renderHeaders()}
        {this.renderEmbed()}
        {this.renderInfo()}
        {this.renderFile()}
        {this.renderFingerprint()}
        {this.renderMatches()}
        {this.renderErrors()}
        {this.renderWrappedResults()}
      </Collapse>
    );
  }

  render() {
    return (
      <Layout className="layout">
        <BackTop />
        <Content>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <h1>The Glorious Contextubot</h1>

            <Search
              placeholder="please enter link here"
              size="large"
              onChange={event => this.handleChange.bind(this)(event)}
              onSearch={value => this.handleSearch.bind(this)(value)}
            />

            <Steps
              current={this.state.step}
              status={this.state.status}
              style={{ marginTop: 24 }}
            >
              <Step
                title={
                  <span>
                    Analyze Link{' '}
                    {this.state.status === 'process' ? (
                      <Spin
                        size="small"
                        style={{ marginTop: 3, marginLeft: 4 }}
                      />
                    ) : null}
                  </span>
                }
                description={this.state.step0}
              />
              <Step title="Detect Media" description={this.state.step1} />
              <Step title="Fingerprint" description={this.state.step2} />
              <Step title="Show Context" description={this.state.step3} />
            </Steps>

            {/* this.renderTitle() */}
            {/* this.renderThumbnail() */}
            {/* this.renderDescription() */}
            {/* this.renderViewCount() */}

            {this.renderCollapse()}
          </div>
        </Content>
      </Layout>
    );
  }
}

export default SearchMedia;
