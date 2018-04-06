import React from 'react';
import styled from 'styled-components';

import { Action, Container, Icon } from '../';
import { breakpoint, color, setSpace, setType } from '../utils';

const FooterEl = styled(Container.withComponent('footer'))`
  ${setSpace('phm')};
  ${setSpace('pvl')};
  ${setType('x')};
  align-content: center;
  align-items: center;
  display: flex;
  flex-shrink: 0;
  max-width: 1400px;
  ${breakpoint.onlyphone} {
    flex-direction: column;
    & > * {
      ${setSpace('mvm')};
      text-align: center;
    }
  }
`;

const FooterTagline = styled.p`
  & i {
    color: ${color.redM};
    line-height: 0;
  }
`;

const Footer = props => (
  <FooterEl limit="l">
    <Container flex={[1, 1, '50%']}>
      <FooterTagline>
        <Action onClick={() => props.history.push('/')}>
          <Icon name="contextubot" size="l" />
        </Action>{' '}
        Legit media from legit sources.
      </FooterTagline>
    </Container>
    <Container flex={[1, 1, '50%']} align="right">
      <Action
        alt
        href="https://github.com/BadIdeaFactory/"
        rel="noopener noreferrer"
        target="_blank"
      >
        Bad Idea Factory
        <Icon name="github" size="l" />
      </Action>
    </Container>
  </FooterEl>
);

export default Footer;
