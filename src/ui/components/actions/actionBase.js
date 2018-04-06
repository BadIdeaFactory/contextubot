import { color, radius, setSpace, setType, time } from '../../utils';

const actionBase = {
  graphic: `
    ${setSpace('phs')};
    ${setSpace('pvs')};
    ${setType('x')};
    align-content: center;
    align-items: center;
    border-color: transparent;
    border-radius: ${radius.x};
    border-style: solid;
    border-width: 1px;
    box-shadow: 0 2px 4px ${color.shadowLt};
    box-sizing: border-box;
    cursor: pointer;
    display: inline-block;
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-weight: bold;
    justify-content: center;
    line-height: 1.2em;
    max-height: 160px;
    max-width: 160px;
    outline: none;
    overflow: hidden;
    text-align: center;
    text-decoration: none;
    text-overflow: ellipsis;
    transition:
      background-color ${time.m},
      border-color ${time.m},
      box-shadow ${time.m},
      color ${time.m},
      opacity ${time.m},
      transform ${time.m}
    ;
    &:active {
      text-decoration: none;
      transform: translateY(1px);
    }
    &:focus {
      text-decoration: none;
    }
  `,
  textual: `
    ${setType('x')};
    align-content: center;
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    display: inline-block;
    display: inline-flex;
    font-weight: bold;
    line-height: 1.2em;
    outline: none;
    padding: 0;
    text-decoration: none;
    transition:
      color ${time.m},
      opacity ${time.m},
      transform ${time.m}
    ;
    &:active {
      transform: translateY(1px);
    }
  `
};

export default actionBase;
