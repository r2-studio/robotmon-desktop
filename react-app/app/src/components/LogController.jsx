import React, { Component } from 'react';
import { Tab, Nav, NavItem } from 'react-bootstrap';
import _ from 'lodash';

import { CLogsEB } from '../modules/event-bus';

const keepLogNumber = 100;
const styleMsg = { fontFamily: 'consloas, sans-serif, monospace, 微軟正黑體', whiteSpace: 'nowrap', width: 0 };
const styleMsgError = { color: '#FB4343' };
const styleMsgWarning = { color: '#F8D532' };
const styleMsgInfo = { color: 'white' };

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

  componentDidMount() {
    CLogsEB.addListener(CLogsEB.EventNewLog, (tag, level, message, style = undefined) => {
      this.newLog(tag, level, message, style);
    });
  }

  onTabSelected(key) {
    this.setState({ tabsKey: key });
  }

  newLog(tag, level, message, style) {
    if (_.isUndefined(this.state.logs[tag])) {
      this.state.logs[tag] = [];
    }
    this.state.logs[tag].push({ level, message, style });
    if (this.state.logs[tag].length > keepLogNumber) {
      this.state.logs[tag].shift();
    }
    this.setState({
      logs: this.state.logs,
    });
  }

  render() {
    const tabContainers = [];
    const tabContents = [];
    _.forEach(this.state.logs, (msgs, tag) => {
      const messages = [];
      if (this.state.tabsKey === tag) {
        _.forEach(msgs, (msg, i) => {
          if (msg.level === CLogsEB.LevelError) {
            messages.push(<div key={i} style={Object.assign({}, styleMsg, styleMsgError)}>{msg.message}</div>);
          } else if (msg.level === CLogsEB.LevelWarning) {
            messages.push(<div key={i} style={Object.assign({}, styleMsg, styleMsgWarning)}>{msg.message}</div>);
          } else {
            messages.push(<div key={i} style={Object.assign({}, styleMsg, styleMsgInfo, msg.style)}>{msg.message}</div>);
          }
        });
      }
      tabContainers.push(<NavItem key={tag} eventKey={tag}>{tag}</NavItem>);
      tabContents.push(<Tab.Pane key={tag} eventKey={tag}>{messages.map(v => v)}</Tab.Pane>);
    });
    return (
      <div className="panel-container">
        <Tab.Container activeKey={this.state.tabsKey} onSelect={this.onTabSelected} id="controlled-tab-example">
          <div>
            <Nav bsStyle="pills" className="toolbar">
              {tabContainers.map(v => v)}
            </Nav>
            <Tab.Content animation>
              {tabContents.map(v => v)}
            </Tab.Content>
          </div>
        </Tab.Container>
      </div>
    );
  }
}
