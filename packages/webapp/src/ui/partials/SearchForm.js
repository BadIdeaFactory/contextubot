import React, { Component } from 'react';
import styled from 'styled-components';

import { Action, Form, FormItem, TextInput } from '../';
import { setSpace } from '../utils';

const SearchFormEl = styled(Form)`
  position: relative;
  & input {
    padding-right: 120px;
  }
  & button {
    ${setSpace('mas')};
    position: absolute;
    right: 1px;
    top: 1px;
    min-width: 110px;
    z-index: 50;
  }
`;

export default class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: 'https://www.youtube.com/watch?v=Uc6zD6gTfEE'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  handleSubmit(e) {
    if (e) e.preventDefault();
    this.props.handleSubmit(this.state.searchKey);
  }
  render() {
    const hasSearchKey = this.state.searchKey.length > 0;
    return (
      <SearchFormEl onSubmit={this.handleSubmit}>
        <FormItem>
          <TextInput
            placeholder="Paste in a video link, i.e. https://www.youtube.com/watch?v=3g39ZaBIbwg"
            onChange={this.handleChange}
            value={this.state.searchKey}
            name="searchKey"
          />
          <Action primary onClick={hasSearchKey ? this.handleSubmit : null}>
            Find source
          </Action>
        </FormItem>
      </SearchFormEl>
    );
  }
}
