import React, { Component, PropTypes } from 'react';

export default class SaveButton extends Component {

  render() {
    return (
      <button id="oligrapherSaveButton" className="btn btn-sm btn-default" onClick={this.props.save}>
        <span className="glyphicon glyphicon-save"></span>
      </button>
    );
  }
}
