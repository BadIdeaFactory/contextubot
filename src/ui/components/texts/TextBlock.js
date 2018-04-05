import css from 'styled-components';
import Text from './Text';

const TextBlock = css(Text.withComponent('div'))`
`;

export default TextBlock;
