import React from 'react';
import styled from 'styled-components';

import { Action, Brandmark, Container } from '../';
import { breakpoint, setSpace } from '../utils';

const HeaderEl = styled(Container.withComponent('header'))`
  ${setSpace('phm')};
  ${setSpace('pvl')};
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

const Header = props => (
  <HeaderEl limit="l">
    <Container flex={[1, 1, '20%']}>
      <Action onClick={() => props.history.push('/')}>
        <Brandmark />
      </Action>
    </Container>
    <Container flex={[1, 1, '60%']}> </Container>
    <Container flex={[1, 1, '20%']}> </Container>
  </HeaderEl>
);

export default Header;
