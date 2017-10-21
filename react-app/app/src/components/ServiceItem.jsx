import React, { Component } from 'react';
import { ListGroupItem, Button, Row, Col, FormControl } from 'react-bootstrap';
import {} from '../styles/global.css';

export default class ServiceItem extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      connectIP: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ connectIP: e.target.value });
  }

  render() {
    const ipStyle = { fontSize: 20 };
    if (this.props.item) {
      return (
        <ListGroupItem>
          <Row className="show-grid">
            <Col sm={8} style={ipStyle}>{this.props.item.ip}</Col>
            <Col sm={4}><Button bsStyle="success" bsSize="sm">Editor</Button></Col>
          </Row>
        </ListGroupItem>
      );
    }
    return (
      <ListGroupItem>
        <Row className="show-grid">
          <Col sm={8} style={ipStyle}>
            <FormControl
              type="text"
              value={this.state.connectIP}
              placeholder="Enter IP"
              onChange={this.handleChange}
            />
          </Col>
          <Col sm={4}><Button bsStyle="success" bsSize="sm">Add</Button></Col>
        </Row>
      </ListGroupItem>
    );
  }
}
