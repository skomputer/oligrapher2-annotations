import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import GraphAnnotationListItem from './GraphAnnotationListItem';

export default class GraphAnnotationList extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleSort');
  }

  render() {
    return (
      <ul id="oligrapherAnnotationList">
          { this.props.annotations.map((annotation, index) =>
            <GraphAnnotationListItem 
              key={annotation.id}
              sortData={annotation.id}
              annotation={annotation} 
              show={this.props.show} 
              currentIndex={this.props.currentIndex}
              index={index} />
          ) }
          <button 
            id="oligrapherCreateGraphAnnotationButton"
            className="btn btn-sm btn-default" 
            onClick={this.props.create}>
            <span>+</span>
          </button>
      </ul>
    );
  }

  _handleSort(data) {
    console.log(data);
    this.props.reorder(data);
  }
}