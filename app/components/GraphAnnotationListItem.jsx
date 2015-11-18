import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';

const GraphAnnotationListItem = React.createClass({

  render() {
    let active = this.props.currentIndex == this.props.index;

    return (
      <li
        className={active ? "oligrapherAnnotationListItem active" : "oligrapherAnnotationListItem"} 
        draggable={false}
        onClick={this._handleClick}>
        {this.props.annotation.header}
      </li>
    );
  },

  _handleClick() {
    this.props.show(this.props.index);
  }
});

export default GraphAnnotationListItem;