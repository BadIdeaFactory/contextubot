import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SearchMedia from './SearchMedia';
import TranscriptView from './TranscriptView';
import ComicView from './ComicView';
import Button from 'antd/lib/button';
import axios from 'axios';
import isUrl from 'is-url-superb';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"

// It is also responsible for holding state.

let API = 'https://api2.contextubot.net';
if (document.location.hostname === '127.0.0.1.xip.io')
  API = 'http://localhost:8080';
if (document.location.hostname === 'eb.127.0.0.1.xip.io')
  API = 'http://contextubot-dev-api.us-east-1.elasticbeanstalk.com';

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
      preview: false
    };
    main = this;
  }

  handleChange(event) {
    console.log('handleChange event.target.value =' + event.target.value);

    if (event.target.value === '') {
      console.log('about to set state');
      main.setState({
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

    axios
      .post(`${API}?url=${encodeURIComponent(value.trim())}`)
      .then(({ data }) => {
        console.log(data);
        main.setState({
          data,
          status: 'finish'
        });

        if (data.headers) {
          main.setState({
            step0: data.headers['content-type']
          });
        }

        // media?
        if (data.info) {
          main.setState({
            step: 1,
            status: 'finish',
            step1: data.info.extractor
          });
        } else if (data.file) {
          main.setState({
            step: 1,
            status: 'finish',
            step1: `${data.file.streams.length} streams`
          });
        }

        // fingerprint?
        if (data.fingerprint) {
          main.setState({
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
          main.setState({
            step: 3,
            status: 'finish'
          });
        }
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
    return (
      <main>
        <Switch>
          <Route exact path="/" render={() => <SearchMedia main={this} />} />
          <Route path="/TranscriptView" component={TranscriptView} />
          <Route path="/ComicView" component={ComicView} />
        </Switch>
      </main>
    );
  }
}

export default Main;
