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

import './styles/global.css';

export default class App extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      scriptPath: '',
      editorValue: '',
      editorClient: undefined,
      isMenuService: true,
      isMenuFiles: false,
      isMenuAssets: false,
    };
    this.onMenuChange = this.onMenuChange.bind(this);
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
          editorClient: new EditorClient(ip),
        });
      }
    });
  }

  onMenuChange(buttonType) {
    let isMenuService = false;
    let isMenuFiles = false;
    let isMenuAssets = false;

    switch (buttonType) {
      case 'service':
        isMenuService = true;
        break;
      case 'files':
        isMenuFiles = true;
        break;
      case 'assets':
        isMenuAssets = true;
        break;
      default:
        break;
    }
    this.setState({
      isMenuService,
      isMenuFiles,
      isMenuAssets,
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
            <button className={this.state.isMenuService ? 'button-blue' : 'button-menu'} onClick={() => this.onMenuChange('service')}><img src="./src/images/ic_phone.png" /></button>
            {/* <button className={this.state.isMenuFiles ? 'button-blue' : 'button-menu'} onClick={() => this.onMenuChange('files')}><img src="./src/images/ic_files.png" /></button> */}
            <button className={this.state.isMenuAssets ? 'button-blue' : 'button-menu'} onClick={() => this.onMenuChange('assets')}><img src="./src/images/ic_photo.png" /></button>
          </div>
          <div id="browser">
            <ServiceController display={this.state.isMenuService} />
            {!_.isUndefined(this.state.editorClient) && <ScreenCrops editorClient={this.state.editorClient} display={this.state.isMenuAssets} />}
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
              <LogController />
            </div>
          </div>
          <div id="inspector">
            <div id="monitor">
              { !_.isUndefined(this.state.editorClient) && <ScreenController editorClient={this.state.editorClient} /> }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
