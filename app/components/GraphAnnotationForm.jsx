import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { merge, pick } from 'lodash';
import Editor from 'react-medium-editor';

export default class GraphAnnotationForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.bindAll('_handleHeaderChange', '_handleTextChange', '_handleClose', '_handleRemove');
    this.state = pick(this.props.annotation, ['header', 'text']);
  }

  render() {
    return (
      <div id="oligrapherGraphAnnotationForm">
        <textarea
          id="oligrapherGraphAnnotationFormHeader"
          ref="header"
          className="form-control input-lg" 
          placeholder="annotation header"
          value={this.props.annotation.header}
          onChange={this._handleHeaderChange}></textarea>
        <Editor
          ref="editor"
          id="oligrapherGraphAnnotationFormText"
          text={this.state.text}
          options={{ placeholder: { text: "annotation text" }}}
          onChange={this._handleTextChange} />
        <button 
          className="btn btn-danger btn-sm" 
          onClick={this._handleRemove}>Remove</button>
      </div>
    );
  }

  componentDidMount() {
    this.refs.editor.medium.subscribe("blur", () => {
      this.saveText();
    });
  }

  componentWillReceiveProps(props) {
    this.setState(merge({ header: null, text: null }, pick(props.annotation, ['header', 'text'])));
  }

  _handleClose() {
    this.props.swapEditForm();
  }

  _handleRemove() {
    if (confirm("Are you sure you want to delete this annotation?")) {
      this.props.remove(this.props.index);
      this.props.swapEditForm();
    }
  }

  _handleHeaderChange(event) {
    this.setState({ header: event.target.value });
    this.props.update(this.props.index, { header: event.target.value, text: this.state.text });
  }

  _handleTextChange(value, medium) {
    this.setState({ text: value });
  }

  saveText() {
    this.props.update(this.props.index, this.state);
  }

  _handleChange(field, value) {
    this.setState({ [field]: value });
    this._apply();
  }

  _apply() {
    let header = this.refs.header.value;
    let text = this.refs.text.value;
    this.props.update(this.props.index, { header, text });
  }
}