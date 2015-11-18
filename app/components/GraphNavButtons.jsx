import React, { Component, PropTypes } from 'react';

export default class GraphNavButtons extends Component {

  render() {
    return (
      <div id="oligrapherNavButtons">
        <button 
          className="btn btn-lg btn-default" 
          onClick={this.props.prevClick} 
          disabled={!this.props.prevClick}>Prev</button>
        <button 
          className="clickplz btn btn-lg btn-default" 
          onClick={this.props.nextClick} 
          disabled={!this.props.nextClick}>Next</button>
        { this.props.isEditor ?
          <button
            id="oligrapherNavListButton"
            className="btn btn-lg btn-default"
            onClick={this.props.swapList}>List</button> : null }
      </div>
    );
  }
}