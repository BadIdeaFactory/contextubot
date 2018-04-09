import css from 'styled-components';
import { bool } from 'prop-types';

import { color, setSpace } from '../../utils';
import actionBase from './actionBase';

const Button = css.button`

  /* primary */

  ${({ primary, alternative }) =>
    primary
      ? `
        &, &:active {
          ${actionBase.graphic};
          background: ${alternative ? color.blueM : color.redM};
          color: ${color.white};
        }
      `
      : null}

  /* secondary */

  ${({ secondary, alternative }) =>
    secondary
      ? `
        &, &:active {
          ${actionBase.graphic};
          color: ${alternative ? color.blueM : color.redM};
        }
      `
      : null}

  /* plain */

  ${({ primary, secondary, alternative }) =>
    !primary && !secondary
      ? `
        &, &:active {
          ${actionBase.textual};
          color: ${alternative ? color.blueM : color.redM};
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
  alternative: bool,
  primary: bool,
  secondary: bool
};

Button.defaultProps = {
  alternative: false,
  primary: false,
  secondary: false
};

export default Button;
