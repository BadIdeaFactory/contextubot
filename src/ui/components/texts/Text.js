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

`;

Text.propTypes = {
  display: string
};

Text.defaultProps = {};

export default Text;
