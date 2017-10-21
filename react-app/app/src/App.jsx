import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ServiceController from './components/ServiceController.jsx';

export default class App extends Component {
  constructor(props) {
    super();
    this.props = props;
  }

  render() {
    return (
      <Grid fluid>
        <Row className="show-grid">
          <Col sm={4}>
            <ServiceController />
          </Col>
          <Col sm={8}>F</Col>
        </Row>
      </Grid>
    );
  }
}
