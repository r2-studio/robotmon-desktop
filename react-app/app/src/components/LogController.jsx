import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, Tabs, Tab, Col, FormGroup, FormControl, Button } from 'react-bootstrap';
import _ from 'lodash';
import fs from 'fs';
import electron from 'electron';

import { CLogsEB } from '../modules/event-bus';
import {} from '../styles/global.css';

const keepLogNumber = 100;
const styleMsg = {
  fontFamily: 'Menlo,Monaco,Consolas,"Courier New",monospace',
};
const styleMsgError = { color: 'red' };
const styleMsgWarning = { color: 'orange' };
const styleMsgInfo = { color: '#666' };

export default class Logs extends Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.state = {
      tabsKey: CLogsEB.TagDesktop,
      logs: {
        [CLogsEB.TagDesktop]: [],
      },
    };

    this.newLog = this.newLog.bind(this);
    this.onTabSelected = this.onTabSelected.bind(this);
  }

  static get propTypes() {
    return {
    };
  }

  componentDidMount() {
    CLogsEB.addListener(CLogsEB.EventNewLog, (tag, level, message) => {
      this.newLog(tag, level, message);
    });
  }

  onTabSelected(key) {
    this.setState({ tabsKey: key });
  }

  newLog(tag, level, message) {
    if (_.isUndefined(this.state.logs[tag])) {
      this.state.logs[tag] = [];
    }
    this.state.logs[tag].push({ level, message });
    if (this.state.logs[tag].length > keepLogNumber) {
      this.state.logs[tag].shift();
    }
    this.setState({
      logs: this.state.logs,
    });
  }

  render() {
    const uiTabs = [];
    _.forEach(this.state.logs, (msgs, tag) => {
      const messages = [];
      if (this.state.tabsKey === tag) {
        _.forEach(msgs, (msg, i) => {
          if (msg.level === CLogsEB.LevelError) {
            messages.push(<div key={i} style={Object.assign({}, styleMsg, styleMsgError)}>{msg.message}</div>);
          } else if (msg.level === CLogsEB.LevelWarning) {
            messages.push(<div key={i} style={Object.assign({}, styleMsg, styleMsgWarning)}>{msg.message}</div>);
          } else {
            messages.push(<div key={i} style={Object.assign({}, styleMsg, styleMsgInfo)}>{msg.message}</div>);
          }
        });
      }
      uiTabs.push(<Tab key={tag} eventKey={tag} title={tag}>{messages.map(v => v)}</Tab>);
    });
    return (
      <div className="panel-container">
        <div className="panel-header">
          Log Controller
        </div>
        <Tabs activeKey={this.state.tabsKey} onSelect={this.onTabSelected} id="controlled-tab-example">
          {uiTabs.map(v => v)}
        </Tabs>
      </div>
    );
  }
}
