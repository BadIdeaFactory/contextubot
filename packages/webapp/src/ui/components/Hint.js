import css from 'styled-components';

import { color, setSpace, setType } from '../utils';

const Hint = css.p`
  ${setSpace('pvx')};
  ${setType('x')};
  color: ${color.blueM};
  font-weight: 600;
  text-align: center;
`;

Hint.propTypes = {};

Hint.defaultProps = {};

export default Hint;
