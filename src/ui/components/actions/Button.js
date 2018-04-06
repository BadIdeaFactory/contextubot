import css from 'styled-components';
import { bool } from 'prop-types';

import { color, setSpace } from '../../utils';
import actionBase from './actionBase';

const Button = css.button`

  /* primary */

  ${({ primary, alt }) =>
    primary
      ? `
        &, &:active {
          ${actionBase.graphic};
          background: ${alt ? color.blueM : color.redM};
          color: ${color.white};
        }
      `
      : null}

  /* secondary */

  ${({ secondary, alt }) =>
    secondary
      ? `
        &, &:active {
          ${actionBase.graphic};
          color: ${alt ? color.blueM : color.redM};
        }
      `
      : null}

  /* plain */

  ${({ primary, secondary, alt }) =>
    !primary && !secondary
      ? `
        &, &:active {
          ${actionBase.textual};
          color: ${alt ? color.blueM : color.redM};
        }
    `
      : null}

  & > i:first-child {
    ${setSpace('mrx')};
  }
  & > i:last-child {
    ${setSpace('mlx')};
  }

`;

Button.propTypes = {
  alt: bool,
  primary: bool,
  secondary: bool
};

Button.defaultProps = {
  alt: false,
  primary: false,
  secondary: false
};

export default Button;
