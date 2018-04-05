import css from 'styled-components';
import React from 'react';
import { bool, string } from 'prop-types';

import { color, font, radius, setSpace, setType, time } from '../../utils';

const Input = css.input`
  ${setSpace('phm')};
  ${setSpace('pvm')};
  ${setType('x')};
  background: ${color.white};
  border-radius: ${radius.m};
  border: 1px solid ${color.greyHL};
  box-shadow: none;
  color: ${({ disabled }) => (disabled ? color.greyBlk : color.blueBlk)};
  font-family: ${font.primary};
  position: relative;
  resize: none;
  transition: border-color ${time.m};
  width: 100%;
  &:focus {
    border-width: 1px;
    box-shadow: inset 0 0 0 2px ${color.redM};
    outline: none;
    z-index: 50;
  }
  &::placeholder {
    ${setType('x')};
    color: ${color.greyLLt};
    font-family: ${font.primary};
  }
  ${({ valid }) =>
    valid === false
      ? `
    border-color: ${color.redM} !important;
    z-index: 50;
  `
      : ``};
  ${({ area }) =>
    area
      ? `
    min-height: 100px;
  `
      : ``}
  ${({ place }) => {
    if (place === 'left') {
      return `border-radius: ${radius.m} 0 0 ${radius.m}; left: 1px`;
    } else if (place === 'right') {
      return `border-radius: 0 ${radius.m} ${radius.m} 0; right: 1px`;
    }
    if (place !== null) {
      return `border-radius: 0`;
    }
    return null;
  }};
  ${({ nooffset }) => (nooffset ? `right: 0; left: 0;` : ``)};
`;

const Button = css(Input.withComponent('button'))`
  text-align: left;
  cursor: pointer;
`;

const Textarea = Input.withComponent('textarea');

const TextInput = props => {
  if (props.file) {
    const handler = e => {
      e.preventDefault();
      props.onClick();
    };
    return (
      <Button {...props} onClick={e => handler(e)}>
        {props.selected ? '' : 'Select file…'}
      </Button>
    );
  }
  return props.area ? <Textarea {...props} /> : <Input {...props} />;
};

TextInput.propTypes = {
  area: bool,
  file: bool,
  input: bool,
  nooffset: bool,
  place: string
};

TextInput.defaultProps = {
  area: false,
  file: false,
  input: false,
  nooffset: false,
  place: null
};

export default TextInput;
