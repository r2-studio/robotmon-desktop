import React, { Component } from 'react';
import _ from 'lodash';
import dgram from 'dgram';

import { CServiceControllerEB } from '../modules/event-bus';
import ServiceItem from './ServiceItem.jsx';

export default class ServiceController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: {},
    };
    this.listenBroadcast = this.listenBroadcast.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
  }

  componentDidMount() {
    this.listenBroadcast();
    CServiceControllerEB.addListener(CServiceControllerEB.EventNewItem, (ip) => {
      this.addNewItem(ip);
    });
  }

  listenBroadcast() {
    const receiver = dgram.createSocket('udp4');
    receiver.bind(8082);
    receiver.on('message', (msg, info) => {
      if (msg.toString() === 'robotmon') {
        this.addNewItem(info.address);
      }
    });
  }

  addNewItem(ip) {
    // test is the format of ip
    if (/^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(ip)) {
      this.state.devices[ip] = ip;
      this.setState({ devices: this.state.devices });
    }
  }

  render() {
    return (
      <div className="panel-container">
        <div className="panel-header">
          Service Controller
        </div>
        <ServiceItem ip="" />
        {_.values(this.state.devices).map((ip, key) => <ServiceItem key={key} ip={ip} />)}
      </div>
    );
  }
}
