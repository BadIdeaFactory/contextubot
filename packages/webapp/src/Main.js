/* eslint-disable */
import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import SearchMedia from './SearchMedia';
import TranscriptView from './TranscriptView';
import ComicView from './ComicView';
import Button from 'antd/lib/button';
import axios from 'axios';
import isUrl from 'is-url-superb';
import PubNub from 'pubnub';

import { Footer, Header, Layout } from './ui';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"

// It is also responsible for holding state.

let API = 'https://api.contextubot.net';
// if (document.location.hostname === '127.0.0.1.xip.io')
//   API = 'http://localhost:8080';
// if (document.location.hostname === 'eb.127.0.0.1.xip.io')
//   API = 'http://contextubot-dev-api.us-east-1.elasticbeanstalk.com';

const pubnub = new PubNub({
  subscribeKey: 'sub-c-79339ef4-3622-11e8-8741-e2a40c21c595',
  publishKey: 'pub-c-0c10c685-2b8a-4aa9-a835-766676172c5a',
  ssl: true
});

let main;

class Main extends React.Component {
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
      preview: false,
      message: ''
    };
    main = this;

    pubnub.addListener({
      message: m => {
        const msg = m.message;
        console.log(msg);
        setTimeout(() => {
          if (msg.audio) this.setState({ message: `searching: extracted audio…`});
          if (msg.fingerprint) this.setState({ message: `searching: fingerprinted audio…`});
          if (msg.search) this.setState({ message: `searching…`});
          if (msg.hash && msg.matches.length > 0) {
            this.state.data.matches = this.state.data.matches.concat(msg.matches.map(r => ({
              duration: r.duration,
              start: r.start,
              time: r.time,
              source: r.match,
              nhashaligned: r.alignedHashes,
              // aligntime: 85584,
              nhashraw: r.totalHashes,
              rank: r.rank,
            }))).sort((a, b) => a.rank - b.rank);
            this.setState({
              message: `searching: found ${msg.matches.length} matches in ${msg.hash} for ${msg.id}`,
              data: this.state.data,
            });
          }
        }, 0);
      }
    });
  }

  // I don’t think it’s used anywhere anymore
  // handleChange(event) {
  //   console.log('handleChange event.target.value =' + event.target.value);
  //
  //   if (event.target.value === '') {
  //     console.log('about to set state');
  //     main.setState({
  //       status: 'wait',
  //       step0: '',
  //       step1: '',
  //       step2: '',
  //       step3: '',
  //       data: {},
  //       step: 0
  //     });
  //   }
  // }

  handleSearch(value) {
    console.log('in search ... value = ' + value);

    console.log(this);
    main.setState({
      status: 'test'
    });

    console.log('after set state');

    if (!isUrl(value)) {
      main.setState({
        status: 'error',
        step0: 'invalid link'
      });
      return;
    }

    main.setState({
      data: {},
      step: 0,
      step0: '',
      step1: '',
      step2: '',
      step3: '',
      status: 'process'
    });

    console.log(API); // so that builds pass :/

    axios
      .post(
        `${API}/query?url=${encodeURIComponent(value.trim())}`,
        {},
        { timeout: 3 * 60 * 1000 }
      )
      /* as well as uncommenting the above, comment the line below for live data */
      // .get(`../dummy.json`, {}, { timeout: 3 * 60 * 1000 })
      .then(({ data }) => {
        console.log(data.data);
        const id = data.data.find(k => !!k.event).event.requestContext.requestId;
        console.log(id);

        pubnub.subscribe({ channels: [id] });

        const partialData = {
          id,
          headers: data.data.find(k => !!k.headers).headers,
          embed: data.data.find(k => !!k.oembed).oembed,
          info: data.data.find(k => !!k.info).info,
          file: null,
          fingerprint: `https://s3.amazonaws.com/data.contextubot.net/wave/${id}/audio.afpt`,
          matches: [],
        };

        // console.log('the data');
        console.log(partialData);
        main.setState({
          data: partialData,
          status: 'finish',
          message: `searching…`
        });

        if (data.headers) {
          main.setState({
            step0: data.headers['content-type']
          });
        }

        // // media?
        // if (data.info) {
        //   main.setState({
        //     step: 1,
        //     status: 'finish',
        //     step1: data.info.extractor
        //   });
        // } else if (data.file) {
        //   main.setState({
        //     step: 1,
        //     status: 'finish',
        //     step1: `${data.file.streams.length} streams`
        //   });
        // }
        //
        // // fingerprint?
        // if (data.fingerprint) {
        //   main.setState({
        //     step: 2,
        //     status: 'finish',
        //     step2: (
        //       <a href={data.fingerprint}>
        //         <Button type="dashed" size="small">
        //           Download
        //         </Button>
        //       </a>
        //     )
        //   });
        // }
        //
        // // matches?
        // if (data.matches) {
        //   main.setState({
        //     step: 3,
        //     status: 'finish'
        //   });
        // }
      })
      .catch(error => {
        console.log(error);
        main.setState({
          status: 'error',
          step0: error.message
        });
      });
  }

  render() {
    const { matches } = this.state.data;
    const { pathname } = this.props.location;

    const establishExtra = () => {
      const hasSearch = matches !== undefined && matches.length > 0;
      const isSingleView =
        pathname.includes('TranscriptView') || pathname.includes('ComicView');
      if (isSingleView) {
        return 'title'; // render title
      }
      return hasSearch ? 'search' : null; // render search form
    };

    return (
      <Layout>
        <Header hasExtra={establishExtra()} main={this} {...this.props} />
        <Switch>
          <Route
            exact
            path="/"
            render={() => <SearchMedia main={this} {...this.props} />}
          />
          <Route path="/TranscriptView" component={TranscriptView} />
          <Route path="/ComicView" component={ComicView} />
        </Switch>
        <Footer {...this.props} />
      </Layout>
    );
  }
}

export default withRouter(Main);
