import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem, Button, Row, Col, FormControl } from 'react-bootstrap';

import { CAppEB, CServiceControllerEB } from '../modules/event-bus';
import {} from '../styles/global.css';

export default class ServiceItem extends Component {
  constructor(props) {
    super();
    this.props = props;
    this.state = {
      textIP: '',
    };

    this.onAddClick = this.onAddClick.bind(this);
    this.onEditorClick = this.onEditorClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  static get propTypes() {
    return {
      ip: PropTypes.string.isRequired,
    };
  }

  onAddClick() {
    CServiceControllerEB.emit(CServiceControllerEB.EventNewItem, this.state.textIP);
    this.setState({ textIP: '' });
  }

  onEditorClick() {
    CAppEB.emit(CAppEB.EventNewEditor, this.props.ip);
  }

  handleChange(e) {
    this.setState({ textIP: e.target.value });
  }

  render() {
    const ipStyle = { fontSize: 20 };
    if (this.props.ip !== '') {
      return (
        <ListGroupItem>
          <Row className="show-grid">
            <Col sm={8} style={ipStyle}>{this.props.ip}</Col>
            <Col sm={4}><Button bsStyle="success" bsSize="sm" onClick={this.onEditorClick}>Editor</Button></Col>
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
              value={this.state.textIP}
              placeholder="Enter IP"
              onChange={this.handleChange}
            />
          </Col>
          <Col sm={4}><Button bsStyle="success" bsSize="sm" onClick={this.onAddClick}>Add</Button></Col>
        </Row>
      </ListGroupItem>
    );
  }
}
