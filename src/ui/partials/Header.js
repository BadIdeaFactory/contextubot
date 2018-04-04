import React from 'react';
import styled from 'styled-components';

import { Container } from '../components';
import { Brandmark } from '../partials';

const HeaderEl = styled(Container.withComponent('header'))``;

const Header = props => (
  <HeaderEl padded align="center">
    <Brandmark />
  </HeaderEl>
);

export default Header;
