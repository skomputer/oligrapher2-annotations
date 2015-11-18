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

    return this;
  }

  oligrapher() {
    return this.root.getWrappedInstance().oli;
  }

  exportAnnotation() {
    return this.root.getWrappedInstance().props.annotation;
  }

  export() {
    return {
      graph: this.root.getWrappedInstance().state.graph,
      annotations: this.root.getWrappedInstance().props.annotations
    };
  }
};

window.OligrapherAnnotations = OligrapherAnnotations;

