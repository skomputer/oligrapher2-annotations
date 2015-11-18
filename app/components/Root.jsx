import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { loadAnnotations, showAnnotation, updateAnnotation, 
         deleteAnnotation, createAnnotation, moveAnnotation } from '../actions';
import { HotKeys } from 'react-hotkeys';
import BaseComponent from './BaseComponent';
import ZoomButtons from './ZoomButtons';
import GraphTitle from './GraphTitle';
import GraphByLine from './GraphByLine';
import GraphNavButtons from './GraphNavButtons';
import GraphAnnotationList from './GraphAnnotationList';
import GraphAnnotation from './GraphAnnotation';
import GraphAnnotationForm from './GraphAnnotationForm';
import Graph from '../models/Graph';
import { merge, cloneDeep, isNumber, keys } from 'lodash';

export default class Root extends BaseComponent {
  constructor(props) {
    super(props);
    let graph = props.config.data ? props.config.data : {};
    this.state = { graph: graph, isEditor: false, editForm: false, navList: false };
  } 

  render() {
    let { graph, user, date, editForm, isEditor, navList } = this.state;
    let { dispatch, annotation, annotations, currentIndex } = this.props;
    let prevId = this._prevId();
    let nextId = this._nextId();

    let prevClick = isNumber(prevId) ? () => this._show(prevId) : null;
    let nextClick = isNumber(nextId) ? () => this._show(nextId) : null;
    let update = (id, data) => dispatch(updateAnnotation(id, data));
    let remove = (id) => dispatch(deleteAnnotation(id));
    let swapEditForm = () => this._swapEditForm();
    let swapList = () => this._swapNavList();
    let show = (id) => this._show(id);
    let create = () => dispatch(createAnnotation());
    let move = (from, to) => dispatch(moveAnnotation(from, to));

    let { zoomIn, zoomOut } = this;

    let keyMap = {
      'altE': 'alt+e',
      'left': 'left',
      'right': 'right'
    };

    let keyHandlers = {
      'altE': () => this._swapEditForm(),
      'left': () => this._show(prevId),
      'right': () => this._show(nextId)
    };

    let navComponent = (
      <GraphNavButtons 
        prevClick={prevClick} 
        nextClick={nextClick} 
        isEditor={isEditor}
        swapList={swapList} />
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
      <div id="oligrapherAnnotationsContainer" className="container-fluid" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>          
          <div className="row">
            <div className="col-md-8">
              <div id="oligrapherHeader">
                <GraphTitle graph={graph} />
                { user || date ? <GraphByLine user={user} date={date} /> : null }
              </div>
              <div id="oligrapherGraphContainer">
                <div id="oligrapherGraph"></div>
                <ZoomButtons zoomIn={zoomIn} zoomOut={zoomOut} />
              </div>
            </div>
            <div className="col-md-4">
              { annotation ? navComponent : null }
              { annotation && navList ? navListComponent : null }
              { annotation ? (editForm ? formComponent : annotationComponent) : null }
            </div>
          </div>
        </HotKeys>
      </div>
    );
  }

  componentDidMount() {
    this._updateGraphHeight()

    let isEditor = this.props.config.isEditor;

    // prepare core oligrapher config
    let element = ReactDOM.findDOMNode(this);
    let graphElement = element.querySelector("#oligrapherGraph");
    let config = merge({}, this.props.config, { isEditor: false, isLocked: false, root: graphElement });

    // pre-apply initial highlights to initial data so that it doesn't start with animated transition
    let startIndex = config.startIndex ? (config.annotations[config.startIndex] ? config.startIndex : 0) : 0;
    let highlightedData = Graph.setHighlights(config.data, config.annotations[config.startIndex], true);
    config = merge({}, config, { data: highlightedData });

    config.onUpdate = (graph) => {      
      this.setState({ graph });

      // oli might not be fully initialized yet
      if (this.oli) {
        let highlights = this.oli.getHighlights();
        let updateData = { 
          nodeIds: keys(highlights.nodes), 
          edgeIds: keys(highlights.edges), 
          captionIds: keys(highlights.captions) 
        }
        this.props.dispatch(updateAnnotation(this.props.currentIndex, updateData));
      }
    }

    this.oli = new config.oligrapher(config);
    this.setState({ graph: this.oli.export(), user: config.user, date: config.date, isEditor: isEditor });

    this.zoomIn = () => this.oli.zoomIn();
    this.zoomOut = () => this.oli.zoomOut();

    if (config.startIndex) {
      this.props.dispatch(showAnnotation(config.startIndex));
    }

    if (config.annotations) {
      this.props.dispatch(loadAnnotations(config.annotations));
    }
  }

  componentDidUpdate(prevProps) {
    this._updateGraphHeight();

    if (this.props.annotation) {
      let faded = true;
      this.oli.setHighlights(this.props.annotation, faded);
    }
  }

  _updateGraphHeight() {
    let element = ReactDOM.findDOMNode(this);
    let headerElement = element.querySelector("#oligrapherHeader")
    let graphElement = element.querySelector("#oligrapherGraph");
    graphElement.style.height = (element.offsetHeight - headerElement.offsetHeight) + "px";
  }

  _prevId() {
    let { currentIndex, num } = this.props;
    return currentIndex - 1 < 0 ? null : currentIndex - 1;
  }

  _nextId() {
    let { currentIndex, num } = this.props;
    return currentIndex + 1 > num - 1 ? null : currentIndex + 1;
  }

  _swapEditForm() {
    if (this.state.isEditor) {
      this.setState({ editForm: !this.state.editForm });
    }
  }

  _swapNavList() {
    if (this.state.isEditor) {
      this.setState({ navList: !this.state.navList });
    }
  }

  _show(id) {
    if (isNumber(id) && id !== this.props.currentIndex) {
      this.props.dispatch(showAnnotation(id));
    }
  }
}

function select(state) {
  return {
    num: state.annotations.length,
    annotation: state.annotations[state.position.currentIndex],
    annotations: state.annotations,
    currentIndex: state.position.currentIndex,
  };
}

export default connect(select, null, null, { withRef: true })(Root);