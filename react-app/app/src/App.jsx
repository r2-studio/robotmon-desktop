import React, { Component } from 'react';
import {} from './styles/global.css';
import Logo from './components/Logo.jsx';
import Link from './components/Link.jsx';

import ServiceManager from './modules/service-manager';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
    };

    ServiceManager.scanService().then(devices => this.setState({ devices }));
  }

  render() {
    return (
      <ul>
        {
          this.state.devices.map((item, idx) => <li key={idx}>{item.pid} </li>)
        }
      </ul>
    );
  }
}
