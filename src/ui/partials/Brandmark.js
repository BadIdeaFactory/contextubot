import React from 'react';
import styled from 'styled-components';

import { SVGLogo } from '../';
import { setHeight } from '../utils';

const BrandmarkEl = styled.h1`
  display: inline-block;
`;
const BrandmarkImg = styled.img`
  ${setHeight('s')};
`;

const Brandmark = () => (
  <BrandmarkEl>
    <BrandmarkImg src={SVGLogo} alt="Contextubot" />
  </BrandmarkEl>
);

export default Brandmark;
