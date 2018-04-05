import React from 'react';
import styled from 'styled-components';

import { SVGLogo } from '../';

const BrandmarkEl = styled.h1`
  display: inline-block;
`;

const Brandmark = () => (
  <BrandmarkEl>
    <img src={SVGLogo} alt="Contextubot" height="20px" />
  </BrandmarkEl>
);

export default Brandmark;
