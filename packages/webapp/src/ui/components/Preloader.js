import css, { keyframes } from 'styled-components';
import React from 'react';

import { color, radius } from '../utils';

const bouncedelay = keyframes`
  0%, 33%, 100% {
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  } 66% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
`;

const PreloaderEl = css.div`
  display: inline-block;
  line-height: 0;
  height: 1em;
  padding-top: 2px;
  padding-bottom: 2px;
  & > div {
    animation: ${bouncedelay} 1s infinite ease-in-out both;
    background-color: ${color.redM};
    border-radius: ${radius.a};
    display: inline-block;
    height: 8px;
    margin-left: 1px;
    margin-right: 1px;
    width: 8px;
  }
  & > div:nth-child(1) {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
  }
  & > div:nth-child(2) {
    -webkit-animation-delay: 0s;
    animation-delay: 0s;
  }
`;

const Preloader = props => (
  <PreloaderEl {...props} className="ctxb-preloader">
    <div />
    <div />
  </PreloaderEl>
);

Preloader.propTypes = {};

Preloader.defaultProps = {};

export default Preloader;
