import React, { Component } from 'react';
import _ from 'lodash';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import fs from 'fs';

import { CAppEB, CEditorEB, CServiceControllerEB } from './modules/event-bus';
import EditorClient from './modules/editor-client';
import ServiceController from './components/ServiceController';
import LogController from './components/LogController';
import ScreenController from './components/ScreenController';
import ScreenCrops from './components/ScreenCrops';

export default class App extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      ipAddr: '',
      scriptPath: '',
      editorValue: '',
      editorClient: undefined,
    };
    this.onEditorChange = this.onEditorChange.bind(this);
    this.onFileRead = this.onFileRead.bind(this);
    this.onFileSave = this.onFileSave.bind(this);
    this.onFileRun = this.onFileRun.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    CEditorEB.addListener(CEditorEB.EventClientChanged, this.onStateChange);
  }

  componentDidMount() {
    CAppEB.addListener(CAppEB.EventNewEditor, (ip) => {
      if (ip !== '') {
        this.setState({
          ipAddr: ip,
          editorClient: new EditorClient(ip),
        });
      }
    });
  }

  onEditorChange(newValue) {
    this.setState({ editorValue: newValue });
  }

  onStateChange(ip) {
    if (this.state.editorClient.ip === ip) {
      CServiceControllerEB.emit(CServiceControllerEB.EventDeviceStateChanged, ip, this.state.editorClient.connectState);
    }
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
    if (_.isUndefined(this.state.editorClient)) {
      return;
    }
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
            <ScreenCrops editorClient={this.state.editorClient} />
          </div>
          <div id="main">
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
            <div id="console">
              <div className="toolbar" />
              <LogController />
            </div>
          </div>
          <div id="inspector">
            <div id="monitor">
              <ScreenController editorClient={this.state.editorClient} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
