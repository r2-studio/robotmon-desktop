import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, Col, FormGroup, FormControl, Button } from 'react-bootstrap';
import _ from 'lodash';
import fs from 'fs';
import electron from 'electron';

import {} from '../styles/global.css';

export default class Scripts extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    console.log(props.editorClient);

    this.state = {
      scriptPath: '',
    };

    this.onBrowseClick = this.onBrowseClick.bind(this);
    this.onRunClick = this.onRunClick.bind(this);
    this.runScriptByPath = this.runScriptByPath.bind(this);
  }

  static get propTypes() {
    return {
      ip: PropTypes.string.isRequired,
      editorClient: PropTypes.object.isRequired,
    };
  }

  onBrowseClick() {
    electron.remote.dialog.showOpenDialog({ properties: ['openFile'] }, (filePaths) => {
      if (!_.isUndefined(filePaths) && filePaths.length > 0 && filePaths[0] !== '') {
        this.setState({
          scriptPath: filePaths[0],
        });
      }
    });
  }

  onRunClick() {
    if (this.state.scriptPath !== '') {
      this.runScriptByPath(this.state.scriptPath);
    }
  }

  runScriptByPath(scriptPath) {
    const js = fs.readFileSync(scriptPath);
    this.props.editorClient.client.runScript(js.toString())
      .then(() => {
        console.log('run script success', scriptPath);
      })
      .catch(() => {
        console.log('run script failed', scriptPath);
      });
  }

  render() {
    return (
      <div>
        <Panel header="Scripts Controller">
          <FormGroup>
            <Col sm={2}>
              <Button onClick={this.onBrowseClick}>Browse</Button>
            </Col>
            <Col sm={8}>
              <FormControl type="text" placeholder="script path" value={this.state.scriptPath} />
            </Col>
            <Col sm={2}>
              <Button onClick={this.onRunClick}>Run</Button>
            </Col>
          </FormGroup>

        </Panel>
      </div>
    );
  }
}
