import React, { Component, PropTypes } from 'react';

export default class EditButton extends Component {

  render() {
    return (
      <button id="oligrapherEditButton" className="btn btn-sm btn-default" onClick={this.props.toggle}>
        <span className="glyphicon glyphicon-pencil"></span>
      </button>
    );
  }
}
