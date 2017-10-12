import React, { Component } from 'react';
import {} from '../styles/global.css';

export default class ServiceItem extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.item.pid}</td>
        <td>{this.props.item.ip}</td>
        <td><button>Link</button></td>
      </tr>
    );
  }
}
