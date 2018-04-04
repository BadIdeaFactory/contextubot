import React from 'react';
import styled from 'styled-components';

import { color, setType } from '../utils';

const BrandmarkEl = styled.h1`
  ${setType('m')};
  color: ${color.redM};
  display: inline-block;
  font-weight: bold;
`;

const Brandmark = () => <BrandmarkEl>Contextubot</BrandmarkEl>;

export default Brandmark;
