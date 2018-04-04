import React from 'react';
import styled from 'styled-components';

import { Container } from '../components';

const FooterEl = styled(Container.withComponent('footer'))`
  flex-shrink: 0;
`;

const Footer = () => (
  <FooterEl padded align="center">
    <a href="https://github.com/BadIdeaFactory/contextubot">
      The Glorious Contextubot
    </a>
    <span> — created by </span>
    <a href="https://github.com/BadIdeaFactory">Bad Idea Factory</a>
  </FooterEl>
);

export default Footer;
