import React from 'react';
import styled from 'styled-components';

import { Action, Brandmark, Container, Icon } from '../';
import { setSpace } from '../utils';

const FooterEl = styled(Container.withComponent('footer'))`
  ${setSpace('pvh')};
  flex-shrink: 0;
`;

const Footer = () => (
  <FooterEl align="center" dir="row" limit="l">
    <Container flex={[1, 1, '50%']} align="left">
      <Action
        href="https://github.com/BadIdeaFactory/contextubot"
        rel="noopener noreferrer"
        target="_blank"
      >
        <Brandmark />
      </Action>
    </Container>
    <Container flex={[1, 1, '50%']} align="right">
      <Action href="https://github.com/BadIdeaFactory/">
        Bad Idea Factory
        <Icon name="github" size="l" />
      </Action>
    </Container>
  </FooterEl>
);

export default Footer;
