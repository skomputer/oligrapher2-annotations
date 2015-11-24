import React, { Component, PropTypes } from 'react';
import GraphTitle from './GraphTitle';
import GraphByLine from './GraphByLine';
import GraphLinks from './GraphLinks';

export default class GraphHeader extends Component {

  render() {
    let { showAnnotations, hasAnnotations, swapAnnotations, 
          graph, user, date, links } = this.props;

    return (
      <div id="oligrapherHeader">
        { !showAnnotations && hasAnnotations ? 
          <div id="oligrapherShowAnnotations">
            <button onClick={() => swapAnnotations()} className="btn btn-lg btn-default">
              <span className="glyphicon glyphicon-font"></span>
            </button>
          </div> : null }
        <GraphTitle graph={graph} />
        { user || date ? <GraphByLine user={user} date={date} /> : null }
        { links ? <GraphLinks links={links} /> : null}
      </div>

    );
  }
}