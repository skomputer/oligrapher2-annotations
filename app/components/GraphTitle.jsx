import React, { Component, PropTypes } from 'react';

export default class GraphTitle extends Component {

  render() {
    return (
      <h1 id="oligrapherTitle">{this.props.title}</h1>
    );
  }
}