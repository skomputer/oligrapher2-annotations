import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { showAnnotation } from './actions';
import Root from './components/Root';
import reducers from './reducers';

export default class OligrapherAnnotations {
  constructor(config) {
    this.rootElement = config.domRoot;
    this.store = createStore(reducers);

    this.providerInstance = ReactDOM.render(
      <Provider store={this.store}>
        <Root {...config} ref={c => this.root = c} />
      </Provider>,
      this.rootElement
    );

    this.editor = this.root.getWrappedInstance().editor;
    this.oligrapher = this.root.getWrappedInstance().editor.oligrapher;

    return this;
  }

  exportAnnotation() {
    return this.root.getWrappedInstance().props.annotation;
  }

  showAnnotation(index) {
    this.root.dispatchProps.dispatch(showAnnotation(index));
  }

  export() {
    let instance = this.root.getWrappedInstance();

    return {
      title: instance.props.graphTitle,
      graph: instance.graphWithoutHighlights(),
      annotations: instance.props.annotations,
      settings: instance.props.graphSettings
    };
  }

  toggleEditor(value) {
    this.root.getWrappedInstance().toggleEditor(value);
  }

  toggleEditTools(value) {
    this.root.getWrappedInstance().toggleEditTools(value);
  }

  toggleSaveButton(value) {
    this.root.getWrappedInstance().toggleSaveButton(value);
  }
};

window.OligrapherAnnotations = OligrapherAnnotations;

