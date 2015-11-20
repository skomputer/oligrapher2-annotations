import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import GraphNavButtons from './GraphNavButtons';
import GraphAnnotationList from './GraphAnnotationList';
import GraphAnnotation from './GraphAnnotation';
import GraphAnnotationForm from './GraphAnnotationForm';

export default class GraphAnnotations extends Component {

  render() {
    let { prevClick, nextClick, isEditor, editForm, navList, 
          swapList, swapAnnotations, annotation, currentIndex, 
          update, remove, swapEditForm, annotations, show, 
          create, move } = this.props;

    let navComponent = (
      <GraphNavButtons 
        prevClick={prevClick} 
        nextClick={nextClick} 
        isEditor={isEditor}
        swapList={swapList}
        swapAnnotations={swapAnnotations} />
    );

    let formComponent = (
      <GraphAnnotationForm 
        annotation={annotation} 
        index={currentIndex} 
        update={update} 
        remove={remove}
        swapEditForm={swapEditForm} />
    );

    let annotationComponent = (
      <GraphAnnotation 
        annotation={annotation} 
        index={currentIndex} 
        isEditor={isEditor}
        swapEditForm={swapEditForm} />
    );

    let navListComponent = (
      <GraphAnnotationList
        currentIndex={currentIndex}
        annotations={annotations}
        show={show} 
        create={create}
        move={move} />
    );

    return (
      <div id="oligrapherAnotations" className="col-md-4">
        { annotation ? navComponent : null }
        { annotation && navList ? navListComponent : null }
        { annotation ? (editForm ? formComponent : annotationComponent) : null }
      </div>
    );
  }
}