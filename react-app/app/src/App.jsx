import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';

import { CAppEB } from './modules/event-bus';
import ServiceController from './components/ServiceController.jsx';
import Editor from './components/Editor.jsx';
import Logs from './components/Logs.jsx';

export default class App extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      editorIP: '',
    };
    this.editors = {};
    this.addNewEditor = this.addNewEditor.bind(this);
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

  render() {
    return (
      <Grid fluid>
        <Row className="show-grid">
          <Col sm={3}>
            <ServiceController />
            <Logs />
          </Col>
          <Col sm={9}>
            <Editor ip={this.state.editorIP} />
          </Col>
        </Row>
      </Grid>
    );
  }
}
