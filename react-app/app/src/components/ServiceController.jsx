import React, { Component } from 'react';
import { Panel, ListGroup } from 'react-bootstrap';
import ServiceManager from '../modules/service-manager';
import ServiceItem from './ServiceItem.jsx';
import {} from '../styles/global.css';

export default class ServiceController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
    };
  }

  componentDidMount() {
    // Using ServiceControll to receive broadcast
    ServiceManager.scanService().then(devices => console.log(devices));
    ServiceManager.scanService().then(devices => this.setState({ devices }));
  }

  render() {
    return (
      <div>
        <Panel header="Service Controller">
          <ListGroup>
            <ServiceItem />
            {
              this.state.devices.map((item, index) => <ServiceItem key={index} item={item} />)
            }
          </ListGroup>
        </Panel>
      </div>
    // <div className="Card">
    //   Service Controller
    //   <table>
    //     <thead>
    //       <tr>
    //         <td>pid</td>
    //         <td>ip</td>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {
    //         this.state.devices.map((item, index) => <ServiceItem key={index} item={item} />)
    //       }
    //     </tbody>
    //   </table>
    // </div>
    );
  }
}
