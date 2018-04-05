import React from 'react';
import styled from 'styled-components';

import { Container } from '../';

const ContentEl = styled(Container.withComponent('main'))`
  flex: 1 0 auto;
`;

const Content = props => <ContentEl limit="l" padded {...props} />;

export default Content;
