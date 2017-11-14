import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import fs from 'fs';

import { CAppEB } from './modules/event-bus';
import ServiceController from './components/ServiceController.jsx';
import Editor from './components/Editor.jsx';
import LogController from './components/LogController.jsx';

export default class App extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      editorValue: '',
      editorIP: '',
    };
    this.editors = {};
    this.addNewEditor = this.addNewEditor.bind(this);
    this.onFileRead = this.onFileRead.bind(this);
    this.onFileSave = this.onFileSave.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  componentDidMount() {
    CAppEB.addListener(CAppEB.EventNewEditor, (ip) => {
      this.addNewEditor(ip);
    });
  }

  addNewEditor(ip) {
    if (ip !== '') {
      this.setState({
        editorIP: ip,
      });
    }
  }

  onFileRead(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    this.currentFilePath = file.path;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      this.setState({ editorValue: content });
    };
    reader.readAsText(file);
  }

  onFileSave() {
    try {
      fs.writeFileSync(this.currentFilePath, this.state.editorValue, 'utf-8');
    } catch (e) {
      alert('Failed to save the file!');
    }
  }

  onEditorChange(newValue) {
    this.setState({ editorValue: newValue });
  }

  render() {
    return (
      <div>
        <nav>
          <input type="file" onChange={this.onFileRead} />
          <button onClick={this.onFileSave}>Save</button>
          <button className="button-green">Run</button>
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
                <div id="monitor">
                  <Editor ip={this.state.editorIP} />
                </div>
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
