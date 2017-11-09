import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import _ from 'lodash';

import EditorClient from '../modules/editor-client';
import { CEditorEB } from '../modules/event-bus';
import ScriptController from './ScriptController.jsx';
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
    }
  }

  render() {
    if (this.props.ip !== '') {
      const header = `Editor (${this.props.ip}) (${this.state.currentEditor.connectState}) `;
      return (
        <div>
          <div className="panel-header">
            {header}
          </div>
          <Row className="panel-item">
            <Col sm={8}>
              <ScriptController ip={this.props.ip} editorClient={this.state.currentEditor} />
              <ScreenController ip={this.props.ip} editorClient={this.state.currentEditor} />
            </Col>
            <Col sm={4}>
              <ScreenCrops ip={this.props.ip} editorClient={this.state.currentEditor} />
            </Col>
          </Row>
        </div>
      );
    }
    return (
      <div className="panel-header">
        Use Service Controller To Start Editor
      </div>
    );
  }
}
