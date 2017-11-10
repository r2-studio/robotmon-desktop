import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';

import { CAppEB } from './modules/event-bus';
import ServiceController from './components/ServiceController.jsx';
import Editor from './components/Editor.jsx';
import LogController from './components/LogController.jsx';

export default class App extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      editorIP: '',
    };
    this.editors = {};
    this.addNewEditor = this.addNewEditor.bind(this);
    this.readFile = this.readFile.bind(this);
    this.saveFile = this.saveFile.bind(this);
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

  readFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    currentFilePath = file.path;
    
    var reader = new FileReader();
    reader.onload = (e) => {
      var content = e.target.result;
      editor.setValue(content);
    };
    reader.readAsText(file);
  }

  saveFile() {
    var fs = require('fs');
    try {
      fs.writeFileSync(currentFilePath, editor.getValue(), 'utf-8');
    } catch(e) {
      alert('Failed to save the file!');
    }
  }

  onEditorChange() {
    
  }

  render() {
    return (
      <div>
        <nav>
          <input type="file" id="file-input" />
          <button onclick="saveFile();">Save</button>
          <button>Run</button>
          <button>Stop</button>
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
          <div id="editor">
            <AceEditor
              mode="javascript"
              theme="monokai"
              width="100%"
              height="100%"
              onChange={this.onEditorChange}
              name="AceEditor"
              editorProps={{$blockScrolling: true}} />
          </div>
          <div id="inspector">
            <div id="monitor">
              <Editor ip={this.state.editorIP} />
            </div>
            <div id="console">
              <LogController />
            </div>
          </div>
        </div>
      </div>
      // <Grid fluid>
      //   <Row className="show-grid">
      //     <Col sm={3}>
      //       <ServiceController />
      //       <LogController />
      //     </Col>
      //     <Col sm={9}>
      //       <Editor ip={this.state.editorIP} />
      //     </Col>
      //   </Row>
      // </Grid>
    );
  }
}
