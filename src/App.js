import React, { Component } from 'react';

import { Layout, BackTop, Input, Steps } from 'antd';
import Button from 'antd/lib/button';

import './App.css';

const { Header, Content, Footer } = Layout;
const Search = Input.Search;
const Step = Steps.Step;

class App extends Component {
  render() {
    return (
      <Layout className="layout">
        <BackTop />
        <Content>
          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Search
            placeholder="please enter link here"
            size="large"
            onSearch={value => console.log(value)}
          />
          <Steps current={2} status="error" style={{marginTop: 24}}>
            <Step title="Analyze Link" description="This is a description description description description." />
            <Step title="Detect Media" description="This is a description." />
            <Step title="Fingerprint" description="This is a description." />
            <Step title="Show Context" description="This is a description." onClick={() => console.log(111)} />
          </Steps>


          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          The Glorious Contextubot — created by Bad Idea Factory
        </Footer>
      </Layout>
    );
  }
}

export default App;
