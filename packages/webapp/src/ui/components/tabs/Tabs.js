import css from 'styled-components';

import { color } from '../../utils';

const Tabs = css.ul`
  align-content: stretch;
  align-items: stretch;
  background-color: ${color.greyWt};
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%:
`;

Tabs.propTypes = {};

Tabs.defaultProps = {};

export default Tabs;
