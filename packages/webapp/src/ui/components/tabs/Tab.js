import css from 'styled-components';
import React from 'react';
import { array, bool, func, node, oneOfType, string } from 'prop-types';

import { color, font, setSpace, setType, time } from '../../utils';

const TabEl = css.li`
  border-style: solid;
  border-color: transparent;
  border-width: 1px;
  flex: 1 1 100%;
  & > button {
    ${setSpace('pam')};
    ${setType('x')};
    background: none;
    border: none;
    box-shadow: none;
    color: ${color.blueM};
    cursor: pointer;
    display: block;
    font-family: ${font.primary};
    font-weight: bold;
    text-align: center;
    transition: color ${time.m};
    width: 100%;
    outline: none;
  }
  & > button:focus {
    outline: none;
  }
  ${({ active }) =>
    active
      ? `
      background: ${color.white};
      button {
        color: ${color.black};
      }
        `
      : ``}
`;

const Tab = props => (
  <TabEl {...props}>
    <button onClick={props.onClick}>{props.children}</button>
  </TabEl>
);

Tab.propTypes = {
  active: bool,
  children: oneOfType([array, string, node]).isRequired,
  onClick: func
};

Tab.defaultProps = {
  active: false,
  onClick: null
};

export default Tab;
