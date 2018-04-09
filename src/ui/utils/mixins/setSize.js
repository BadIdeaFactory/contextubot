import fluid from '../functions/fluid';

import { sizes } from '../';

export const setHeight = val => fluid([`height`], sizes[val][0], sizes[val][1]);
export const setWidth = val => fluid([`width`], sizes[val][0], sizes[val][1]);
export const setSize = val =>
  fluid([`width`, `height`], sizes[val][0], sizes[val][1]);
