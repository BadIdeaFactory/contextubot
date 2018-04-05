import css from 'styled-components';
import { bool } from 'prop-types';

import { color, setSpace } from '../../utils';
import actionBase from './actionBase';

const Button = css.button`

  /* primary */

  ${({ primary, tone, theme }) =>
    primary
      ? `
        &, &:active {
          ${actionBase.graphic};
          background: ${color.redM};
          color: ${color.flareBlk};
        }
      `
      : null}

  /* secondary */

  ${({ secondary, theme, active }) =>
    secondary
      ? `
        &, &:active {
          ${actionBase.graphic};
          color: ${color.redM};
        }
      `
      : null}

  /* plain */

  ${({ primary, secondary }) =>
    !primary && !secondary
      ? `
        &, &:active {
          ${actionBase.textual};
          color: ${color.redM};
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
  primary: bool,
  secondary: bool
};

Button.defaultProps = {
  primary: false,
  secondary: false
};

export default Button;
