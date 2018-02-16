import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import ReactJson from 'react-json-view';
import axios from 'axios';
import isUrl from 'is-url-superb';

import { Layout, BackTop, Input, Steps, Collapse, Spin, Switch } from 'antd';
import Button from 'antd/lib/button';

import './App.css';

const { Content } = Layout;
const Search = Input.Search;
const Step = Steps.Step;
const Panel = Collapse.Panel;


let API = 'https://api.contextubot.net';
if (document.location.hostname === '127.0.0.1.xip.io') API = 'http://localhost:8080';
if (document.location.hostname === 'eb.127.0.0.1.xip.io') API = 'http://contextubot-dev-api.us-east-1.elasticbeanstalk.com';

class SearchMedia extends Component {
  constructor(props){
    super(props);
    this.state = {
      step: 0,
      status: 'wait',
      step0: '',
      step1: '',
      step2: '',
      step3: '',
      data: {},
      preview: false,
    };
  }

  handleChange(event) {
    if (event.target.value === '') {
      this.setState({
        status: 'wait',
        step0: '', step1: '', step2: '', step3: '',
        data: {},
        step: 0,
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
      step0: '', step1: '', step2: '', step3: '',
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
            step2: <a href={data.fingerprint}><Button type="dashed" icon="download" size="small" style={{marginTop: 10}}>Download</Button></a>
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
    /* return (
      <div style={{
        padding: 16,
        width: 480,
        fontWeight: '600',
        fontSize: 24
      }}>
        <span>{this.state.data.info.title}</span>
      </div>
    ); */
    return null;
  }

  renderThumbnail() {
    if (!this.state.data.embed) return null;
    /*return (
      <div style={{
        padding: 16
      }}>
        <img alt="thumbnail" src={this.state.data.embed[0].thumbnail_url} />
      </div>
    );*/
    return null;
  }

  renderDescription() {
    if (!this.state.data.embed) return null;
    /*return (
      <div style={{
        padding: 16,
        width: 480
      }}>
        <span>{this.state.data.embed[0].description}</span>
      </div>
    );*/
    return null;
  }

  renderViewCount() {
    if (!this.state.data.info) return null;
    /*return (
      <div style={{
        padding: 16,
        width: 480,
        fontWeight: '600'
      }}>
        <span>Views : {new Intl.NumberFormat().format(this.state.data.info.view_count)}</span>
      </div>
    );*/
    return null;
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
    /*return (
      <Panel header="Embed" key="2">
        <ReactJson name="embed" src={this.state.data.embed} />
      </Panel>
    );*/
    return null;
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
        {this.state.data.fingerprint ? <a href={this.state.data.fingerprint}><Button type="primary" icon="download">Download</Button></a> : null}
      </Panel>
    );
  }

  renderErrors() {
    if (!this.state.data.errors) return null;
    const filteredArr = this.state.data.errors.filter((err) => {
      return Object.keys(err).length;
    });

    return (
      <Panel header={`Errors${filteredArr ? ': ' + filteredArr.length : ''}`} key="7">
        <ReactJson name="errors" src={filteredArr} />
      </Panel>
    );
  }

  renderResults() {

    // Probably want to move all these consts into componentDidMount
    if (!this.state.data.fingerprint) return null;
    const uid = 'MSNBCW_20171209_020000_The_Rachel_Maddow_Show';
    const clipStart = 130;
    const clipEnd = 190;
    const mp4Url = "https://archive.org/download/"+uid+"/"+uid+".mp4?t="+clipStart+"/"+clipEnd;
    const transcriptUrl = "transcriptview/?"+uid+"/"+clipStart+"/"+clipEnd;

    return (
      <div>
        <div className="video-hldr">
          <span>The Rachel Maddow Show <br/> MSNBC December 9, 2017 6:03pm-6:15pm PST</span>
          <video className="video" width="300" height="254" controls>
            <source src={mp4Url}/>
          </video>
          <span><Link to={transcriptUrl}>transcriptview </Link></span>
        </div>

        <div className="video-hldr">
          <span>The O Reilly Factor <br/> FOX News February 6, 2017 8:03pm-8:18pm PST</span>
          <video className="video" width="300" height="254" controls>
            <source src="https://archive.org/download/FOXNEWSW_20170207_040300_The_OReilly_Factor/FOXNEWSW_20170207_040300_The_OReilly_Factor.mp4?t=10/70"/>
          </video>
          <span><a href="transcriptview.html?FOXNEWSW_20170207_040300_The_OReilly_Factor/10/70">transcriptview </a></span>
        </div>

        <div className="video-hldr">
          <span>President Trump Holds First Rally Following ... <br/> CSPAN  August 22, 2017 9:43pm-11:29pm EDT</span>
          <video className="video" width="300" height="254" controls>
            <source src="https://archive.org/download/CSPAN_20170823_014300_President_Trump_Holds_First_Rally_Following_Charlottesville_Remarks/CSPAN_20170823_014300_President_Trump_Holds_First_Rally_Following_Charlottesville_Remarks.mp4?t=80/140" />
          </video>
          <span><a href="transcriptview.html?CSPAN_20170823_014300_President_Trump_Holds_First_Rally_Following_Charlottesville_Remarks/80/140">transcriptview </a></span>
        </div>

        <div className="video-hldr">
          <span>President Trump Holds Rally in Melbourne Florida  <br/> CSPAN  February 18, 2017 9:32pm-10:29pm EST</span>
          <video className="video" width="300" height="254" controls>
            <source src="https://archive.org/download/CSPAN_20170219_023200_President_Trump_Holds_Rally_in_Melbourne_Florida/CSPAN_20170219_023200_President_Trump_Holds_Rally_in_Melbourne_Florida.mp4?t=30/90"/>
          </video>
          <span><a href="transcriptview.html?CSPAN_20170219_023200_President_Trump_Holds_Rally_in_Melbourne_Florida/30/90">transcriptview </a></span>
        </div>

        <div className="video-hldr">
          <span>President Trump Says There is Blame on Both Sides <br/> CSPAN   August 15, 2017 6:37pm-7:01pm EDT</span>
          <video className="video" width="300" height="254" controls>
            <source src="https://archive.org/download/CSPAN_20170815_223700_President_Trump_Says_There_is_Blame_on_Both_Sides_for_Violence_in.../CSPAN_20170815_223700_President_Trump_Says_There_is_Blame_on_Both_Sides_for_Violence_in....mp4?t=10/70"/>
          </video>
          <span><a href="transcriptview.html?CSPAN_20170815_223700_President_Trump_Says_There_is_Blame_on_Both_Sides_for_Violence_in.../10/70">transcriptview </a></span>
        </div>

        <div className="video-hldr">
          <span>President Trump Addresses Joint Session of Congress <br/> CSPAN   February 28, 2017 9:03pm-10:15pm EST</span>
          <video className="video" width="300" height="254" controls>
            <source src="https://archive.org/download/CSPAN2_20170301_020300_President_Trump_Addresses_Joint_Session_of_Congress/CSPAN2_20170301_020300_President_Trump_Addresses_Joint_Session_of_Congress.mp4?t=20/80"/>
          </video>
          <span><a href="transcriptview.html?CSPAN2_20170301_020300_President_Trump_Addresses_Joint_Session_of_Congress/20/80">transcriptview </a></span>
        </div>
      </div>
    );
  }

  renderCollapse() {
    if (Object.keys(this.state.data).length === 0) return null;
    /*return (
      <Collapse style={{marginTop: 14}}>
        {this.renderHeaders()}
        {this.renderEmbed()}
        {this.renderInfo()}
        {this.renderFile()}
        {this.renderFingerprint()}
        {this.renderErrors()}
      </Collapse>
    );*/
    return null;
  }

  render() {
    return (
      <Layout className="layout">
        <BackTop />
        <Content>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>

            <h1>The Glorious Contextubot</h1>

            <div style={{ textAlign: 'right', paddingTop: 16, paddingBottom: 16 }}>
              <Switch checkedChildren="Simple" unCheckedChildren="Detailed" />
            </div>

            <Search
              placeholder="please enter link here"
              size="large"
              value="https://www.youtube.com/watch?v=4F4qzPbcFiA"
              onChange={event => this.handleChange.bind(this)(event)}
              onSearch={value => this.handleSearch.bind(this)(value)}
            />

            <Steps current={this.state.step} status={this.state.status} style={{marginTop: 24}}>
              <Step title={<span>Analyze Link {this.state.status === 'process' ? <Spin size="small" style={{marginTop: 3, marginLeft: 4}} /> : null}</span>} description={this.state.step0} />
              <Step title="Detect Media" description={this.state.step1} />
              <Step title="Fingerprint" description={this.state.step2} />
              <Step title="Show Context" description={this.state.step3} />
            </Steps>

            {this.renderTitle()}

            {this.renderThumbnail()}

            {this.renderDescription()}

            {this.renderViewCount()}

            {this.renderResults()}

            {this.renderCollapse()}

          </div>
        </Content>
      </Layout>
    );
  }
}

export default SearchMedia;
