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
import GraphAnnotations from './GraphAnnotations';
import Graph from '../models/Graph';
import { merge, cloneDeep, isNumber, keys } from 'lodash';

export default class Root extends BaseComponent {
  constructor(props) {
    super(props);
    let graph = props.config.data ? props.config.data : {};
    this.state = { graph: graph, isEditor: false, editForm: false, navList: false, showAnnotations: true };
  }

  render() {
    let { graph, user, date, editForm, isEditor, navList, showAnnotations } = this.state;
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
    let swapAnnotations = () => this._swapAnnotations();

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

    return (
      <div id="oligrapherAnnotationsContainer" className="container-fluid" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>          
          <div className="row">
            <div className={showAnnotations ? "col-md-8" : "col-md-12"}>
              <div id="oligrapherHeader">
                { !showAnnotations ? 
                  <div id="oligrapherShowAnnotations">
                    <button onClick={() => this._swapAnnotations()} className="btn btn-lg btn-default">
                      <span className="glyphicon glyphicon-font"></span>
                    </button>
                  </div> : null }
                <GraphTitle graph={graph} />
                { user || date ? <GraphByLine user={user} date={date} /> : null }
              </div>
              <div id="oligrapherGraphContainer">
                <div id="oligrapherGraph"></div>
              </div>
            </div>
            { showAnnotations ?
              <GraphAnnotations 
                isEditor={isEditor}
                navList={navList}
                prevClick={prevClick}
                nextClick={nextClick}
                swapList={swapList}
                swapAnnotations={swapAnnotations}
                annotation={annotation}
                annotations={annotations}
                currentIndex={currentIndex}
                show={show}
                create={create}
                update={update}
                move={move}
                remove={remove}
                editForm={editForm}
                swapEditForm={swapEditForm} /> : null }
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
    let config = merge({ isEditor: false, isLocked: false, domRoot: graphElement }, this.props.config);

    // pre-apply initial highlights to initial data so that it doesn't start with animated transition
    let startIndex = config.startIndex ? (config.annotations[config.startIndex] ? config.startIndex : 0) : 0;
    let highlightedData = Graph.setHighlights(config.data, config.annotations[config.startIndex], true);
    config = merge({}, config, { data: highlightedData });

    config.onUpdate = (graph) => {      
      this.setState({ graph });

      // oli might not be fully initialized yet
      if (this.editor) {
        let highlights = this.editor.oligrapher.getHighlights();
        let updateData = { 
          nodeIds: keys(highlights.nodes), 
          edgeIds: keys(highlights.edges), 
          captionIds: keys(highlights.captions) 
        }
        this.props.dispatch(updateAnnotation(this.props.currentIndex, updateData));
      }
    }

    this.editor = new config.editor(config);
    this.setState({ graph: this.editor.oligrapher.export(), user: config.user, date: config.date, isEditor: isEditor });

    this.zoomIn = () => this.editor.oligrapher.zoomIn();
    this.zoomOut = () => this.editor.oligrapher.zoomOut();

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
      this.editor.oligrapher.setHighlights(this.props.annotation, faded);
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

  _swapAnnotations() {
    this.setState({ showAnnotations: !this.state.showAnnotations });
  }

  _show(id) {
    if (isNumber(id) && id !== this.props.currentIndex) {
      this.props.dispatch(showAnnotation(id));
    }
  }

  graphWithoutHighlights() {
    let graph2 = cloneDeep(this.state.graph);
    values(graph2.nodes).forEach(node => { graph2.nodes[node.id].display.status = "normal" });
    values(graph2.edges).forEach(edge => { graph2.edges[edge.id].display.status = "normal" });
    values(graph2.captions).forEach(caption => { graph2.captions[caption.id].display.status = "normal" });
    return graph2;
  }

  toggleEditor(value) {
    this.setState({ isEditor: value });
    this.editor.toggleEditor(value);
  }

  toggleLocked(value) {
    this.editor.oligrapher.toggleLocked(value);
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