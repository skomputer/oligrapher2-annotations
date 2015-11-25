import React, { Component, PropTypes } from 'react';

export default class SettingsButton extends Component {

  render() {
    return (
      <button id="oligrapherSettingsButton" className="btn btn-sm btn-default" onClick={this.props.toggleSettings}>
        <span className="glyphicon glyphicon-cog"></span>
      </button>
    );
  }
}
