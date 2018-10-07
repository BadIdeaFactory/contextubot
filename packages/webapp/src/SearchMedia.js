import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import styled from 'styled-components';

import { Collapse } from 'antd';

import {
  Action,
  Container,
  Content,
  PageTitle,
  PageSubtitle,
  PNGRationalizer,
  SearchForm,
  Preloader,
  Separator
} from './ui';
import { breakpoint, color, setSpace } from './ui/utils';

import './App.css';

const Panel = Collapse.Panel;

const SearchResultsWrapper = styled(Container)`
  ${breakpoint.onlytablet} {
    max-width: none;
  }
`;

const SearchResults = styled(Container.withComponent('ul'))`
  ${setSpace('man')};
  ${setSpace('pan')};
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  position: relative;
  width: 100%;
`;

const SearchResult = styled(Container.withComponent('li'))`
  ${setSpace('mbl')};
  ${setSpace('prm')};
  flex: 0 0 ${100 / 3}%;
  & > div {
    ${setSpace('mbs')};
    background: ${color.white};
    position: relative;
  }
  & > div > img {
    display: block;
    width: 100%;
  }
  & > div > video {
    bottom: 0;
    height: 100% !important;
    left: 0;
    position: absolute;
    top: 0;
    width: 100% !important;
    z-index: 2;
  }
  ${breakpoint.onlyphone} {
    flex: 0 0 ${100 / 2}%;
    ${setSpace('mbs')};
  }
  & .ctxb-preloader {
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 0;
  }
  ${PageSubtitle} {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

class SearchMedia extends Component {
  renderTitle() {
    if (!this.props.main.state.data.info) return null;
    return (
      <div
        style={{
          padding: 16,
          width: 480,
          fontWeight: '600',
          fontSize: 24
        }}
      >
        <span>{this.props.main.state.data.info.title}</span>
      </div>
    );
  }

  renderThumbnail() {
    if (!this.props.main.state.data.embed) return null;
    return (
      <div
        style={{
          padding: 16
        }}
      >
        <img
          alt="thumbnail"
          src={this.props.main.state.data.embed[0].thumbnail_url}
        />
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
        <span>{this.props.main.state.data.embed[0].description}</span>
      </div>
    );
  }

  renderViewCount() {
    if (!this.props.main.state.data.info) return null;
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
          {new Intl.NumberFormat().format(
            this.props.main.state.data.info.view_count
          )}
        </span>
      </div>
    );
  }

  renderHeaders() {
    if (!this.props.main.state.data.headers) return null;
    return (
      <Panel header="HTTP Headers" key="1">
        <ReactJson name="headers" src={this.props.main.state.data.headers} />
      </Panel>
    );
  }

  renderEmbed() {
    if (!this.props.main.state.data.embed) return null;
    return (
      <Panel header="Embed" key="2">
        <ReactJson name="embed" src={this.props.main.state.data.embed} />
      </Panel>
    );
  }

  renderInfo() {
    if (!this.props.main.state.data.info) return null;
    return (
      <Panel header="Media Options" key="3">
        <ReactJson name="info" src={this.props.main.state.data.info} />
      </Panel>
    );
  }

  renderFile() {
    if (!this.props.main.state.data.file) return null;
    return (
      <Panel header="Media Info" key="4">
        <ReactJson name="file" src={this.props.main.state.data.file} />
      </Panel>
    );
  }

  renderFingerprint() {
    if (!this.props.main.state.data.fingerprint) return null;
    return (
      <Panel header="Fingerprint" key="5">
        {this.props.main.state.data.fingerprint ? (
          <Action href={this.props.main.state.data.fingerprint}>
            Download
          </Action>
        ) : null}
      </Panel>
    );
  }

  renderMatches() {
    if (!this.props.main.state.data.matches) return null;
    return (
      <Panel header="Matches" key="6">
        <ReactJson name="matches" src={this.props.main.state.data.matches} />
      </Panel>
    );
  }

  renderErrors() {
    if (!this.props.main.state.data.errors) return null;
    const filteredArr = this.props.main.state.data.errors.filter(err => {
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

  renderResult(match) {}

  // renderCollapse() {
  //   console.log('In renderCollapse()');
  //   if (Object.keys(this.props.main.state.data).length === 0) return null;
  //   console.log('Object.keys present...');
  //   return (
  //     <Collapse style={{ marginTop: 14 }}>
  //       {this.renderHeaders()}
  //       {this.renderEmbed()}
  //       {this.renderInfo()}
  //       {this.renderFile()}
  //       {this.renderFingerprint()}
  //       {this.renderMatches()}
  //       {this.renderErrors()}
  //     </Collapse>
  //   );
  // }

  handleSubmit(e) {
    if (e) e.preventDefault();
    this.props.main.handleSearch.bind(this)(this.state.searchKey);
  }

  render() {
    const { main } = this.props;
    /* this.renderTitle() */
    /* this.renderThumbnail() */
    /* this.renderDescription() */
    /* this.renderViewCount() */

    const hasFetchedResults = Object.keys(main.state.data).length > 0;
    const hasFingerprint = main.state.data.fingerprint !== undefined;
    const hasMatches =
      main.state.data.matches !== undefined &&
      main.state.data.matches.length > 0;
    const isStillSearching = main.state.status === 'process';

    console.log('—— hasFetchedResults: ', hasFetchedResults);
    console.log('—— hasFingerprint: ', hasFingerprint);
    console.log('—— hasMatches: ', hasMatches);
    console.log('—— isStillSearching: ', isStillSearching);
    console.log('——— this.props: ———', this.props);

    const renderForm = () => {
      return (
        <Content dir="row" align="center">
          <Container limit="m">
            <PageTitle display="h1">
              Source-check questionable media. <br />
              Stand by reputable sources.
            </PageTitle>
            <Separator dir="h" silent size="m" />
            <SearchForm
              handleSubmit={data => main.handleSearch.bind(this)(data)}
            />
          </Container>
        </Content>
      );
    };

    const renderResults = () => {
      const renderResult = match => {
        if (!match.duration || match.duration === 0) return null;

        const uid = match.source
          .replace('.afpt', '')
          .replace('_tva', '')
          .replace('/data/archive/week/selected/', '');
        const clipStart = match.time;

        let duration = 180;
        if (match.duration < 180) duration = match.duration;
        const clipEnd = match.time + duration;
        const mp4Url = `https://archive.org/download/${uid}/${uid}.mp4?t=${clipStart}/${clipEnd}`;
        const transcriptURL = `TranscriptView?${uid}/${clipStart}/${clipEnd}`;

        return (
          <SearchResult
            key={mp4Url}
            onClick={() => this.props.history.push(transcriptURL)}
          >
            <div>
              <img src={PNGRationalizer} alt="" />
              <video
                controls
                height="254"
                onClick={e => e.stopPropagation()}
                width="300"
              >
                <source src={mp4Url} />
              </video>
              <Preloader />
            </div>
            <PageSubtitle display="h5">
              {uid.replace(/_/g, ' ')}
              {/* ({match.duration}s) */}
            </PageSubtitle>
          </SearchResult>
        );
      };

      return hasMatches ? (
        <Content>
          <SearchResultsWrapper limit="m">
            <PageTitle display="h2">
              Here are the{' '}
              <strong>{main.state.data.matches.length} possible matches</strong>{' '}
              I found:
            </PageTitle>
            <Separator dir="h" silent size="m" />
            <SearchResults>
              {main.state.data.matches.map(renderResult)}
            </SearchResults>
          </SearchResultsWrapper>
        </Content>
      ) : (
        <Content dir="row" align="center">
          <PageTitle display="h3">
            <span style={{ color: color.redM }}>
              {main.state.message ? main.state.message : '…'}
            </span>
          </PageTitle>
          <Separator silent size="s" />
          ¯\_(ツ)_/¯
        </Content>
      );
    };

    if (isStillSearching) {
      return (
        <Content dir="row" align="center">
          <Preloader />
        </Content>
      );
    } else if (hasFingerprint && hasFetchedResults) {
      return renderResults();
    }
    return renderForm();
  }
}

export default SearchMedia;
