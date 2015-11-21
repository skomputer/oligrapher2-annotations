import React, { Component, PropTypes } from 'react';

export default class GraphLinks extends Component {

  render() {
    let { links } = this.props;

    return (
      <div id="oligrapherGraphLinks" style={{ display: "inline-block" }}>
        { links.map((link, i) =>
          <a key={i} id={link.id} href={link.url} target={link.target || "_blank"}>{link.text}</a>
        ) }
      </div>
    );
  }

  _renderUser(user) {
    return (
      <span>by { user.url ? <a id="oligrapherUser" href={user.url} target="_blank">{user.name}</a> : <span id="oligrapherUser">{user.name}</span> }&nbsp;&nbsp;</span>
    );
  }
}