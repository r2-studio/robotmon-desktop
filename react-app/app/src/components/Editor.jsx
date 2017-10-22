import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';
import fp from 'func-pipe';
import _ from 'lodash';

import ServiceClient from '../modules/service-client';
import { CEditorEB } from '../modules/event-bus';
import Scripts from './Scripts.jsx';

import {} from '../styles/global.css';

class EditorClient {
  constructor(ip) {
    this.ip = ip;
    this.isConnect = false;
    this.connectState = 'connecting...';

    this.client = new ServiceClient(ip);
    this.client.init();
    this.testConnection();
  }

  testConnection() {
    fp
      .pipe(fp.bindObj(this.client.runScript, this.client, 'console.log("Robotmon Desktop Connect");'))
      .pipe(() => {
        this.isConnect = true;
        this.connectState = 'connected';
      })
      .catch(() => {
        this.isConnect = false;
        this.connectState = 'disconnect';
      })
      .pipe(() => CEditorEB.emit(CEditorEB.EventClientChanged, this.ip));
  }
}

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentEditor: {},
    };
    this.editorClients = {};
    this.isConnect = false;

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
          <Panel header={header}>
            <Scripts ip={this.props.ip} editorClient={this.state.currentEditor} />
          </Panel>
        </div>
      );
    }
    return (
      <div>
        <Panel header="Use Service Controller To Start Editor" />
      </div>
    );
  }
}
