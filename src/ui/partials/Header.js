import React from 'react';
import styled from 'styled-components';

import { Action, Brandmark, Container, Icon, PageTitle, SearchForm } from '../';
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
  ${PageTitle} {
    text-align: center;
  }
`;

const Header = props => {
  const params = window.location.search.split('/');
  const uid = params[0].slice(1);

  const renderExtra = () => {
    if (props.hasExtra === 'search') {
      return (
        <SearchForm
          handleSubmit={data => props.main.handleSearch.bind(this)(data)}
        />
      );
    }
    return props.hasExtra === 'title' ? (
      <PageTitle display="h4">{uid}</PageTitle>
    ) : (
      ' '
    );
  };
  return (
    <HeaderEl limit="l">
      <Container flex={[1, 1, '20%']}>
        <Action onClick={() => props.history.push('/')}>
          <Brandmark />
        </Action>
      </Container>
      <Container flex={[1, 1, '60%']}>{renderExtra()}</Container>
      <Container flex={[1, 1, '20%']} align="right">
        {props.hasExtra === 'title' ? (
          <Action primary onClick={() => alert('Post to social!')}>
            <Icon name="share" size="x" /> Share This
          </Action>
        ) : (
          ' '
        )}
      </Container>
    </HeaderEl>
  );
};

export default Header;
