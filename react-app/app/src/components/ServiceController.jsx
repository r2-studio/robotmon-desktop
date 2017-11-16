import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import dgram from 'dgram';

import { CServiceControllerEB } from '../modules/event-bus';
import ServiceItem from './ServiceItem';

export default class ServiceController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: {},
    };
    this.listenBroadcast = this.listenBroadcast.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.itemStatusChanged = this.itemStatusChanged.bind(this);
  }

  static get propTypes() {
    return {
      display: PropTypes.bool.isRequired,
    };
  }

  componentDidMount() {
    this.listenBroadcast();
    CServiceControllerEB.addListener(CServiceControllerEB.EventNewItem, (ip) => {
      this.addNewItem(ip);
    });
    CServiceControllerEB.addListener(CServiceControllerEB.EventDeviceStateChanged, (ip, connectState) => {
      this.itemStatusChanged(ip, connectState);
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
      this.state.devices[ip] = { ip, connectState: CServiceControllerEB.TagStateDisconnected };
      this.setState({ devices: this.state.devices });
    }
  }

  itemStatusChanged(ip, connectState) {
    if (!_.isUndefined(this.state.devices[ip])) {
      this.state.devices[ip].connectState = connectState;
      this.setState({ devices: this.state.devices });
    }
  }

  render() {
    let className = 'panel-container display-none';
    if (this.props.display) {
      className = 'panel-container display-block';
    }
    return (
      <div className={className}>
        <div className="panel-header">
          Service Controller
        </div>
        <ServiceItem ip="" connectState={0} />
        {_.values(this.state.devices).map((device, key) => <ServiceItem key={key} ip={device.ip} connectState={device.connectState} />)}
      </div>
    );
  }
}
