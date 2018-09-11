import React from 'react';
import { string } from 'prop-types';

import Button from './Button';
import Link from './Link';

const Action = props =>
  props.href ? <Link {...props} /> : <Button {...props} />;

Action.propTypes = {
  href: string
};

Action.defaultProps = {
  href: null
};

export default Action;
