import React from 'react';
import styled from 'styled-components';

import { Container } from '../';
import { setSpace } from '../utils';

const ContentEl = styled(Container.withComponent('main'))`
  ${setSpace('phm')};
  ${setSpace('pvh')};
  flex: 1 0 auto;
  & > div {
    margin-left: auto;
    margin-right: auto;
    max-width: 1400px;
    width: 100%;
  }
`;

const Content = props => (
  <ContentEl padded {...props} fill="grey">
    <div>{props.children}</div>
  </ContentEl>
);

export default Content;
