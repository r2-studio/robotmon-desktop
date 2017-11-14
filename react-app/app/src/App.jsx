import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import fs from 'fs';

import { CAppEB } from './modules/event-bus';
import EditorClient from './modules/editor-client';
import ServiceController from './components/ServiceController';
import LogController from './components/LogController';

export default class App extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      ipAddr: '',
      scriptPath: '',
      editorValue: '',
    };
    this.editorClient = new EditorClient(this.state.ipAddr);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.onFileRead = this.onFileRead.bind(this);
    this.onFileSave = this.onFileSave.bind(this);
    this.onFileRun = this.onFileRun.bind(this);
  }

  componentDidMount() {
    CAppEB.addListener(CAppEB.EventNewEditor, (ip) => {
      this.setState({
        ipAddr: ip,
      });
    });
  }

  onEditorChange(newValue) {
    this.setState({ editorValue: newValue });
  }

  onFileRead(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    this.setState({ scriptPath: file.path });

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      this.setState({ editorValue: content });
    };
    reader.readAsText(file);
  }

  onFileSave() {
    try {
      fs.writeFileSync(this.state.scriptPath, this.state.editorValue, 'utf-8');
    } catch (e) {
      alert('Failed to save the file!');
    }
  }

  onFileRun() {
    if (this.state.scriptPath !== '') {
      this.runScriptByPath(this.state.scriptPath);
    }
  }

  runScriptByPath(scriptPath) {
    const js = fs.readFileSync(scriptPath);
    this.editorClient.client.runScript(js.toString())
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
        <nav>
          <input type="file" onChange={this.onFileRead} />
          <button onClick={this.onFileSave}>Save</button>
          <button className="button-green" onClick={this.onFileRun}>Run</button>
          <button className="button-red">Stop</button>
        </nav>
        <div id="container">
          <div id="menu">
            <button>D</button>
            <button>F</button>
            <button>A</button>
          </div>
          <div id="browser">
            <ServiceController />
          </div>
          <div id="main">
            <div id="panel">
              <div id="editor">
                <AceEditor
                  mode="javascript"
                  theme="monokai"
                  width="100%"
                  height="100%"
                  value={this.state.editorValue}
                  onChange={this.onEditorChange}
                  name="AceEditor"
                  editorProps={{ $blockScrolling: true }}
                />
              </div>
              <div id="inspector">
                <div id="monitor" />
              </div>
            </div>
            <div id="console">
              <div className="toolbar" />
              <LogController />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
