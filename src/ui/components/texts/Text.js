import css from 'styled-components';
import { string } from 'prop-types';

import { color, setType } from '../../utils';

const Text = css.span`

  ${({ display }) =>
    display === 'h1'
      ? `
    ${setType('h')};
    color: ${color.black};
    font-weight: 300;
  `
      : ``};

  ${({ display }) =>
    display === 'h2'
      ? `
    ${setType('l')};
    color: ${color.black};
    font-weight: 300;
  `
      : ``};

  ${({ display }) =>
    display === 'h3'
      ? `
    ${setType('m')};
    color: ${color.black};
    font-weight: 400;
  `
      : ``};

  ${({ display }) =>
    display === 'h4'
      ? `
    ${setType('s')};
    color: ${color.black};
    font-weight: 600;
  `
      : ``};
      
  ${({ display }) =>
    display === 'h5'
      ? `
    ${setType('x')};
    color: ${color.black};
    font-weight: 600;
  `
      : ``};

  & strong {
    font-weight: 600;
  }

`;

Text.propTypes = {
  display: string
};

Text.defaultProps = {};

export default Text;
