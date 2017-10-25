import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, Col, FormGroup, FormControl, Button } from 'react-bootstrap';
import _ from 'lodash';
import fp from 'func-pipe';

import electron from 'electron';

import {} from '../styles/global.css';

export default class Screen extends Component {
  constructor(props) {
    super(props);
    // this.props = props;

    this.state = {
      syncDelay: 1000,
      syncImageSize: 600,
      syncQuality: 90,
      syncImageSrc: '',
      posX: 0,
      posY: 0,
    };
    this.onSyncScreenClick = this.onSyncScreenClick.bind(this);
    this.syncScreen = this.syncScreen.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.syncScreenId = setInterval(this.syncScreen, this.state.syncDelay);
    this.editorClient = undefined;
  }

  static get propTypes() {
    return {
      ip: PropTypes.string.isRequired,
      editorClient: PropTypes.object.isRequired,
    };
  }

  componentWillUpdate(nextProps) {
    this.editorClient = nextProps.editorClient;
    if (this.props.editorClient.ip !== nextProps.editorClient.ip) {
      this.state.syncImageSrc = '';
    }
  }

  onSyncScreenClick() {
    if (this.props.editorClient.isSyncScreen) {
      this.props.editorClient.isSyncScreen = false;
    } else {
      this.props.editorClient.isSyncScreen = true;
    }
    this.forceUpdate();
  }

  onMouseMove(e) {
    const imgW = e.target.width;
    const imgH = e.target.height;
    if (imgW > 0 && imgH > 0) {
      this.setState({
        posX: Math.floor((e.nativeEvent.offsetX / imgW) * this.editorClient.screenWidth),
        posY: Math.floor((e.nativeEvent.offsetY / imgH) * this.editorClient.screenHeight),
      });
    }
  }

  syncScreen() {
    if (this.editorClient.isConnect && this.editorClient.isSyncScreen) {
      fp
        .pipe(fp.bind(this.editorClient.client.getScreenSize))
        .pipe((wh) => {
          this.editorClient.screenWidth = wh.width;
          this.editorClient.screenHeight = wh.height;

          const ratio = this.state.syncImageSize / Math.max(wh.width, wh.height);
          const rw = Math.floor(wh.width * ratio);
          const rh = Math.floor(wh.height * ratio);
          return this.editorClient.client.getScreenshot(0, 0, 0, 0, rw, rh, this.state.syncQuality);
        })
        .pipe((result) => {
          this.setState({
            syncImageSrc: `data:image/jpg;base64,${result.image.toString('base64')}`,
          });
        });
    }
  }

  render() {
    return (
      <div>
        <Panel header="Screen Controller">
          <FormGroup>
            <Button
              onClick={this.onSyncScreenClick}
              bsSize="small"
              bsStyle={this.props.editorClient.isSyncScreen ? 'danger' : 'success'}
            >
              {this.props.editorClient.isSyncScreen ? 'Stop sync' : 'Start sync'}
            </Button>
            <Button bsSize="small">Get Color</Button>
            <Button bsSize="small">Crop Image</Button>
          </FormGroup>
          <div>x: {this.state.posX}, y: {this.state.posY}</div>
          <img src={this.state.syncImageSrc} alt="Screenshot here" draggable="false" onMouseMove={this.onMouseMove} />
        </Panel>
      </div>
    );
  }
}
