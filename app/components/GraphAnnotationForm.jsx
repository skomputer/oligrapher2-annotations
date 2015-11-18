import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { merge, pick } from 'lodash';

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
        <textarea 
          id="oligrapherGraphAnnotationFormText"
          ref="text"
          className="form-control"
          placeholder="annotation text"
          value={this.props.annotation.text}
          onChange={this._handleTextChange}></textarea>
        <button 
          className="btn btn-default btn-sm" 
          onClick={this._handleClose}>Done</button>&nbsp;&nbsp;
        <button 
          className="btn btn-danger btn-sm" 
          onClick={this._handleRemove}>Remove</button>
      </div>
    );
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
    this._handleChange(event, 'header');
  }

  _handleTextChange(event) {
    this._handleChange(event, 'text');
  }

  _handleChange(event, field) {
    console.log(field, event.target.value);
    this.setState({ [field]: event.target.value });
    this._apply();
  }

  _apply() {
    let header = this.refs.header.value;
    let text = this.refs.text.value;
    this.props.update(this.props.index, { header, text });
  }
}