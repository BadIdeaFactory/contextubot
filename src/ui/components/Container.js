import css from 'styled-components';
import { arrayOf, bool, number, oneOfType, string } from 'prop-types';

import { breakpoint, color, radius, setSpace } from '../utils';

const Container = css.div`
  position: relative;
  ${({ bordered }) =>
    bordered
      ? `
    border: 1px solid ${color.greyHL};
  `
      : ``};
  ${({ fill }) => {
    if (fill === 'white') {
      return `background: ${color.white}`;
    } else if (fill === 'black') {
      return `background: ${color.black}`;
    } else if (fill === 'grey') {
      return `background: ${color.greyWt}`;
    }
    return null;
  }};
  ${({ hide }) =>
    hide === 'phone'
      ? `
    ${breakpoint.onlyphone} {
      display: none;
    }
  `
      : ''};
  ${({ shift }) =>
    shift
      ? `
    box-shadow: 0 2px 4px ${color.shadowHL};
  `
      : ``};
  ${({ inset }) =>
    inset
      ? `
    box-shadow: inset 0 2px 4px ${color.shadowHL};
  `
      : ``};
  ${({ rounded }) =>
    rounded
      ? `
    border-radius: ${radius.h};
  `
      : ``};
  ${({ padded }) =>
    padded
      ? `
    ${setSpace('pam')};
  `
      : ``};
  ${({ dir }) =>
    dir !== null
      ? `
    align-items: center;
    display: flex;
    flex-direction: ${dir};
    justify-content: center;
  `
      : ``};
  ${({ flex }) =>
    flex !== null
      ? `
    flex: ${flex[0]} ${flex[1]} ${flex[2]};
  `
      : ``};
  ${({ align }) =>
    align !== null
      ? `
    text-align: ${align};
  `
      : ``};
  ${({ cover }) =>
    cover
      ? `
    min-height: 100vh;
  `
      : ``};
  ${({ limit }) => {
    if (limit === 'x') {
      return `
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        max-width: 400px;
        ${breakpoint.tablet} {
          margin-left: auto;
          margin-right: auto;
          max-width: 480px;
        }
        ${breakpoint.desktop} {
          max-width: 560px;
        }
        ${breakpoint.hdesktop} {
          max-width: 640px;
        }
        `;
    } else if (limit === 's') {
      return `
        width: 100%;
        ${breakpoint.tablet} {
          margin-left: auto;
          margin-right: auto;
          max-width: 40%;
        }
      `;
    } else if (limit === 'm') {
      return `
        width: 100%;
        ${breakpoint.tablet} {
          margin-left: auto;
          margin-right: auto;
          max-width: 60%;
        }
      `;
    } else if (limit === 'l') {
      return `
        width: 100%;
        ${breakpoint.tablet} {
          margin-left: auto;
          margin-right: auto;
          max-width: 80%;
        }
      `;
    }
    return null;
  }}`;

Container.propTypes = {
  align: string,
  flex: arrayOf(oneOfType([number, string])),
  cover: bool,
  fill: string,
  dir: string,
  inset: bool,
  limit: string,
  padded: bool,
  rounded: bool,
  shift: bool
};

Container.defaultProps = {
  align: null,
  flex: null,
  cover: null,
  fill: null,
  dir: null,
  inset: null,
  limit: null,
  padded: null,
  rounded: null,
  shift: null
};

export default Container;
