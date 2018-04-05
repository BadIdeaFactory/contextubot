import React from 'react';
import styled from 'styled-components';

import { Brandmark, Container } from '../';

const HeaderEl = styled(Container.withComponent('header'))``;

const Header = props => (
  <HeaderEl padded align="center">
    <Brandmark />
  </HeaderEl>
);

export default Header;
