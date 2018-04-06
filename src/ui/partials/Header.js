import React from 'react';
import styled from 'styled-components';

import { Action, Brandmark, Container, SearchForm } from '../';
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
      flex: 1 1 100%;
      text-align: center;
      width: 100%;
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
    <Container flex={[1, 1, '60%']}>
      {props.hasSearch ? (
        <SearchForm
          handleSubmit={data => props.main.handleSearch.bind(this)(data)}
        />
      ) : null}
    </Container>
    <Container flex={[1, 1, '20%']}> </Container>
  </HeaderEl>
);

export default Header;
