import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Row, Col, FormControl } from 'react-bootstrap';

import { CAppEB, CServiceControllerEB } from '../modules/event-bus';

export default class ServiceItem extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      textIP: '',
    };

    this.onAddClick = this.onAddClick.bind(this);
    this.onEditorClick = this.onEditorClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getButtonColor = this.getButtonColor.bind(this);
    this.getButtonText = this.getButtonText.bind(this);
  }

  static get propTypes() {
    return {
      ip: PropTypes.string.isRequired,
      connectState: PropTypes.string.isRequired,
    };
  }

  onAddClick() {
    CServiceControllerEB.emit(CServiceControllerEB.EventNewItem, this.state.textIP);
    this.setState({ textIP: '' });
  }

  onEditorClick() {
    CAppEB.emit(CAppEB.EventNewEditor, this.props.ip);
  }

  getButtonColor() {
    if (this.props.connectState === CServiceControllerEB.TagStateConnecting
      || this.props.connectState === CServiceControllerEB.TagStateConnected) {
      return 'button button-blue horizontal-content';
    }
    return 'button button-green horizontal-content';
  }

  getButtonText() {
    if (this.props.connectState === CServiceControllerEB.TagStateConnecting
      || this.props.connectState === CServiceControllerEB.TagStateConnected) {
      return this.props.connectState;
    }
    return 'Connect';
  }

  handleChange(e) {
    this.setState({ textIP: e.target.value });
  }

  render() {
    const buttonColor = this.getButtonColor();
    const buttonText = this.getButtonText();

    if (this.props.ip !== '') {
      return (
        <Row className="panel-item">
          <Col sm={6}>{this.props.ip}</Col>
          <Col sm={6}><Button bsClass={buttonColor} onClick={this.onEditorClick}>{buttonText}</Button></Col>
        </Row>
      );
    }
    return (
      <Row className="panel-item">
        <Col sm={6}>
          <FormControl
            bsClass="input-text"
            type="text"
            value={this.state.textIP}
            placeholder="Enter IP"
            onChange={this.handleChange}
          />
        </Col>
        <Col sm={6}><Button bsClass="button button-green horizontal-content" onClick={this.onAddClick}>Add</Button></Col>
      </Row>
    );
  }
}
