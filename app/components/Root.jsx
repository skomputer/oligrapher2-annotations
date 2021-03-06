import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { loadAnnotations, showAnnotation, updateAnnotation, 
         deleteAnnotation, createAnnotation, moveAnnotation,
         setTitle, setSettings } from '../actions';
import { HotKeys } from 'react-hotkeys';
import BaseComponent from './BaseComponent';
import SaveButton from './SaveButton';
import EditButton from './EditButton';
import SettingsButton from './SettingsButton';
import HelpButton from './HelpButton';
import GraphHeader from './GraphHeader';
import GraphAnnotations from './GraphAnnotations';
import GraphSettingsForm from './GraphSettingsForm';
import HelpScreen from './HelpScreen';
import Graph from '../models/Graph';
import { merge, cloneDeep, isNumber, keys, pick } from 'lodash';
import OligrapherEditor from 'oligrapher2-editor';

export default class Root extends BaseComponent {
  constructor(props) {
    super(props);
    let graph = props.graphData ? props.graphData : {};
    this.state = { 
      graph: graph, 
      isEditor: false, 
      editForm: false, 
      navList: false, 
      showAnnotations: true, 
      showEditTools: false,
      showSettings: false,
      showSaveButton: !!props.onSave,
      showHelpScreen: false
    };
  }

  render() {
    let { dispatch, annotation, annotations, currentIndex, user, date, links, url } = this.props;
    let { graph, editForm, isEditor, navList, showAnnotations, 
          showSettings, showSaveButton, showEditTools, showHelpScreen } = this.state;
    let title = this.props.graphTitle;
    let settings = this.props.graphSettings;
    let hasSettings = settings && Object.keys(settings).length > 0;

    let prevId = this._prevId();
    let nextId = this._nextId();

    let prevClick = isNumber(prevId) ? () => this._show(prevId) : null;
    let nextClick = isNumber(nextId) ? () => this._show(nextId) : null;
    let update = (id, data) => dispatch(updateAnnotation(id, data));
    let remove = (id) => dispatch(deleteAnnotation(id));
    let swapEditForm = () => this._swapEditForm();
    let swapList = () => this._swapNavList();
    let show = (id) => this._show(id);
    let create = () => { 
      dispatch(createAnnotation(this.props.annotations.length)); 
      this.toggleEditTools(false); 
    };
    let move = (from, to) => dispatch(moveAnnotation(from, to));
    let swapAnnotations = () => this._swapAnnotations();
    let updateTitle = (title) => dispatch(setTitle(title));
    let updateSettings = (settings) => dispatch(setSettings(settings));
    let toggleSettings = () => this._toggleSettings();

    let keyMap = {
      'altE': 'alt+e',
      'altM': ['alt+m', 'ctrl+m'],
      'altH': ['alt+h', 'ctrl+h'],
      'left': 'left',
      'right': 'right',
      'esc': 'esc'
    };

    let keyHandlers = {
      'altE': () => { isEditor ? this._swapEditForm() : null },
      'altM': () => { isEditor ? this.toggleEditTools() : null },
      'altH': () => { isEditor ? this.toggleHelpScreen() : null },
      'left': () => this._show(prevId),
      'right': () => this._show(nextId),
      'esc': () => this.toggleHelpScreen(false)
    };

    let hasAnnotations = (isEditor || annotations.length > 0);

    return (
      <div id="oligrapherAnnotationsContainer" className="container-fluid" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>          
          <div className="row">
            <div className={showAnnotations && hasAnnotations ? "col-md-8" : "col-md-12"}>
              { isEditor || title ? 
                <GraphHeader
                  showAnnotations={showAnnotations}
                  hasAnnotations={hasAnnotations} 
                  swapAnnotations={swapAnnotations}
                  graph={graph}
                  title={title}
                  url={url}
                  updateTitle={updateTitle}
                  user={user}
                  date={date}
                  links={links}
                  isEditor={isEditor} /> : null }
              <div id="oligrapherGraphContainer">
                <div id="oligrapherGraph"></div>
                <div id="oligrapherMetaButtons">
                  { isEditor ? <EditButton toggle={() => this.toggleEditTools()} showEditTools={showEditTools} /> : null }
                  { isEditor && hasSettings ? <SettingsButton settings={settings} toggleSettings={toggleSettings} /> : null }
                  { isEditor ? <HelpButton toggleHelpScreen={() => this.toggleHelpScreen()} /> : null }
                </div>
                { showSettings && hasSettings ? <GraphSettingsForm settings={settings} updateSettings={updateSettings} /> : null }
              </div>
            </div>
            { showAnnotations && hasAnnotations ?
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
                swapEditForm={swapEditForm} 
                hideEditTools={() => this.toggleEditTools(false)} /> : null }
          </div>
          { !showAnnotations && hasAnnotations ? 
            <div id="oligrapherShowAnnotations">
              <button onClick={() => swapAnnotations()} className="btn btn-lg btn-default">
                <span className="glyphicon glyphicon-font"></span>
              </button>
            </div> : null }
          { showSaveButton && isEditor && this.props.onSave ? <SaveButton save={() => this._handleSave()} /> : null }
          { showHelpScreen ? <HelpScreen source={this.props.dataSource} close={() => this.toggleHelpScreen(false)} /> : null }
        </HotKeys>
      </div>
    );
  }

  componentDidMount() {
    this._updateGraphHeight()
    let isEditor = this.props.isEditor;
    let navList = true

    let hasAnnotations = this.props.annotationsData && this.props.annotationsData.length > 0;
    let startIndex = this.props.startIndex ? (this.props.annotationsData[this.props.startIndex] ? this.props.startIndex : 0) : 0;

    // prepare core oligrapher config
    let element = ReactDOM.findDOMNode(this);
    let graphElement = element.querySelector("#oligrapherGraph");
    let config = merge({ 
      isEditor: false, 
      isLocked: !isEditor || !hasAnnotations, 
      domRoot: graphElement, 
      data: this.props.graphData, 
      viewOnlyHighlighted: !isEditor,
      showEditButton: false,
      hideHelp: true
    }, pick(this.props, ['oligrapher', 'dataSource', 'isEditor', 'isLocked', 'graphHeight']));

    // pre-apply initial highlights to initial data so that it doesn't start with animated transition
    if (hasAnnotations) {
      let highlightedData = Graph.setHighlights(this.props.graphData, this.props.annotationsData[startIndex], true);
      config = merge(config, { data: highlightedData });
    }

    config.onUpdate = (graph) => {      
      this.setState({ graph });

      // editor might not be fully initialized yet
      // make sure there's an annotation to update
      if (this.editor && this.props.annotation) {
        let highlights = this.editor.oligrapher.getHighlights();
        let updateData = { 
          nodeIds: keys(highlights.nodes), 
          edgeIds: keys(highlights.edges), 
          captionIds: keys(highlights.captions) 
        }
        this.props.dispatch(updateAnnotation(this.props.currentIndex, updateData));
      }
    }

    this.editor = new OligrapherEditor(config);

    this.setState({ 
      graph: this.editor.oligrapher.export(), 
      isEditor: this.props.isEditor, 
      showEditTools: this.props.isEditor,
      navList: navList 
    });

    this.editor.toggleEditTools(this.props.isEditor);

    if (hasAnnotations) {
      this.props.dispatch(loadAnnotations(this.props.annotationsData));

      if (startIndex) {
        this.props.dispatch(showAnnotation(startIndex));
      }
    }

    if (this.props.title) {
      this.props.dispatch(setTitle(this.props.title));
    }

    if (this.props.settings) {
      this.props.dispatch(setSettings(this.props.settings));
    }
  }

  componentDidUpdate(prevProps) {
    this._updateGraphHeight();

    if (this.props.annotation) {
      let faded = !this.props.isEditor;
      this.editor.oligrapher.setHighlights(this.props.annotation, faded);
    } else if (prevProps.annotation) {
      // last annotation deleted, so clear highlights
      this.editor.oligrapher.clearHighlights();
    }

    if (this.props.onNav && this.props.currentIndex !== prevProps.currentIndex) {
      this.props.onNav(this.props.currentIndex);
    }

    this._lockOrUnlockEditor(this.state.showEditTools, this.props.annotation);
  }

  _updateGraphHeight() {
    let element = ReactDOM.findDOMNode(this);
    let headerElement = element.querySelector("#oligrapherHeader")
    let graphElement = element.querySelector("#oligrapherGraph");
    let headerHeight = headerElement ? headerElement.offsetHeight : 0;
    let height = element.offsetHeight - headerHeight;
    graphElement.style.height = height + "px";
  }

  _prevId() {
    let { currentIndex, num_annotations } = this.props;
    return currentIndex - 1 < 0 ? null : currentIndex - 1;
  }

  _nextId() {
    let { currentIndex, num_annotations } = this.props;
    return currentIndex + 1 > num_annotations - 1 ? null : currentIndex + 1;
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
    return pick(
      Graph.clearHighlights(this.state.graph),
      ['nodes', 'edges', 'captions']
    );
  }

  toggleEditor(value) {
    value = (typeof value !== "undefined") ? value : !this.state.isEditor;
    this.setState({ isEditor: value });
    this.editor.toggleEditor(value);
    this.toggleEditTools(value);
  }

  toggleLocked(value) {
    this.editor.oligrapher.toggleLocked(value);
  }

  _handleSave() {
    if (this.props.onSave) {
      this.props.onSave({
        title: this.props.graphTitle,
        graph: this.graphWithoutHighlights(),
        annotations: this.props.annotations,
        settings: this.props.graphSettings
      });
    }
  }

  toggleEditTools(value) {
    value = (typeof value !== "undefined") ? value : !this.state.showEditTools;
    this.editor.toggleEditTools(value);
    this.setState({ showEditTools: value, showSettings: false });

    // lock editor if edit tools hidden and no annotations
    this._lockOrUnlockEditor(value, this.props.annotation);
  }

  _lockOrUnlockEditor(showEditTools, hasAnnotations) {
    // graph should be locked if not in editor mode or if edit tools are hidden and no annotations
    this.editor.toggleLocked(!this.state.isEditor || (!showEditTools && !hasAnnotations));
  }

  _toggleSettings() {
    this.editor.toggleEditTools(false);
    this.setState({ showSettings: !this.state.showSettings, showEditTools: false });
  }

  toggleSaveButton(value) {
    value = (typeof value !== "undefined") ? value : !this.state.showSaveButton;
    this.setState({ showSaveButton: value });
  }

  toggleHelpScreen() {
    this.setState({ showHelpScreen : !this.state.showHelpScreen });
  }
}

function select(state) {
  return {
    graphTitle: state.title,
    num_annotations: state.annotations.length,
    annotation: state.annotations[state.position.currentIndex],
    annotations: state.annotations,
    currentIndex: state.position.currentIndex,
    graphSettings: state.settings
  };
}

export default connect(select, null, null, { withRef: true })(Root);