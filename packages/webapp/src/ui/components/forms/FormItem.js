import css from 'styled-components';
import {} from 'prop-types';

import { setSpace } from '../../utils';

const FormItem = css.fieldset`
  ${setSpace('man')};
  ${setSpace('pan')};
  border: none;
  position: relative;
  & > label {
    ${setSpace('mls')};
    left: 0;
    position: absolute;
    top: 0;
    transform: translateY(-50%);
    z-index: 100;
  }
`;

FormItem.propTypes = {};

FormItem.defaultProps = {};

export default FormItem;
