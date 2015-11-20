import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Root from './components/Root';
import reducers from './reducers';

export default class OligrapherAnnotations {
  constructor(config) {
    this.rootElement = config.root;
    this.store = createStore(reducers);

    this.providerInstance = ReactDOM.render(
      <Provider store={this.store}>
        <Root 
          config={config}
          ref={c => this.root = c} />
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

  export() {
    return {
      graph: this.root.getWrappedInstance().graphWithoutHighlights(),
      annotations: this.root.getWrappedInstance().props.annotations
    };
  }

  toggleEditor(value) {
    this.root.getWrappedInstance().toggleEditor(value);
  }
};

window.OligrapherAnnotations = OligrapherAnnotations;

