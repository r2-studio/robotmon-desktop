import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import _ from 'lodash';

import EditorClient from '../modules/editor-client';
import { CEditorEB, CServiceControllerEB } from '../modules/event-bus';
import ScreenController from './ScreenController.jsx';
import ScreenCrops from './ScreenCrops.jsx';

import {} from '../styles/global.css';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentEditor: {},
    };
    this.editorClients = {};

    this.onStateChange = this.onStateChange.bind(this);

    CEditorEB.addListener(CEditorEB.EventClientChanged, this.onStateChange);
  }

  static get propTypes() {
    return {
      ip: PropTypes.string.isRequired,
    };
  }

  componentWillUpdate(nextProps) {
    const nextIP = nextProps.ip;
    if (nextIP !== '' && _.isUndefined(this.editorClients[nextIP])) {
      this.editorClients[nextIP] = new EditorClient(nextIP);
    }
    this.state.currentEditor = this.editorClients[nextIP];
  }

  onStateChange(ip) {
    if (this.state.currentEditor.ip === ip) {
      // this.forceUpdate();
      this.setState({
        currentEditor: this.state.currentEditor,
      });
      CServiceControllerEB.emit(CServiceControllerEB.EventDeviceStateChanged, ip, this.state.currentEditor.connectState);
    }
  }

  render() {
    if (this.props.ip !== '') {
      return (
        <div>
          <Col sm={8}>
            <ScreenController ip={this.props.ip} editorClient={this.state.currentEditor} />
          </Col>
          <Col sm={4}>
            <ScreenCrops ip={this.props.ip} editorClient={this.state.currentEditor} />
          </Col>
        </div>
      );
    }
    return (
      <div />
    );
  }
}
