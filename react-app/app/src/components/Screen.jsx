import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel, Col, FormGroup, FormControl, Button, Radio } from 'react-bootstrap';
import _ from 'lodash';
import fp from 'func-pipe';

import electron from 'electron';

import {} from '../styles/global.css';

export default class Screen extends Component {
  constructor(props) {
    super(props);
    // this.props = props;

    this.state = {
      syncDelay: 800,
      syncImageSize: 600,
      syncQuality: 90,
      syncImageSrc: '',
      posX: 0,
      posY: 0,
    };
    this.onSyncScreenClick = this.onSyncScreenClick.bind(this);
    this.syncScreen = this.syncScreen.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onControlTypeChange = this.onControlTypeChange.bind(this);

    this.isSyncScreen = false;
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.screenControlType = 'tap';
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
    if (this.isSyncScreen) {
      this.isSyncScreen = false;
    } else {
      this.isSyncScreen = true;
    }
    this.forceUpdate();
  }

  onMouseMove(e) {
    const imgW = e.target.width;
    const imgH = e.target.height;
    if (imgW <= 0 && imgH <= 0) {
      return;
    }
    const posX = Math.floor((e.nativeEvent.offsetX / imgW) * this.screenWidth);
    const posY = Math.floor((e.nativeEvent.offsetY / imgH) * this.screenHeight);
    this.setState({ posX, posY });
    if (this.screenControlType === 'tap') {
      this.editorClient.client.moveTo(posX, posY, 50);
    }
  }

  onMouseDown(e) {
    const imgW = e.target.width;
    const imgH = e.target.height;
    if (imgW <= 0 && imgH <= 0) {
      return;
    }
    const posX = Math.floor((e.nativeEvent.offsetX / imgW) * this.screenWidth);
    const posY = Math.floor((e.nativeEvent.offsetY / imgH) * this.screenHeight);
    if (this.screenControlType === 'tap') {
      this.editorClient.client.tapDown(posX, posY, 50);
    }
  }

  onMouseUp(e) {
    const imgW = e.target.width;
    const imgH = e.target.height;
    if (imgW <= 0 && imgH <= 0) {
      return;
    }
    const posX = Math.floor((e.nativeEvent.offsetX / imgW) * this.screenWidth);
    const posY = Math.floor((e.nativeEvent.offsetY / imgH) * this.screenHeight);
    if (this.screenControlType === 'tap') {
      this.editorClient.client.tapUp(posX, posY, 50);
    }
  }

  onControlTypeChange(e) {
    this.screenControlType = e.target.value;
  }

  syncScreen() {
    if (this.editorClient.isConnect && this.isSyncScreen) {
      fp
        .pipe(fp.bind(this.editorClient.client.getScreenSize))
        .pipe((wh) => {
          this.screenWidth = wh.width;
          this.screenHeight = wh.height;

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
              bsStyle={this.isSyncScreen ? 'danger' : 'success'}
            >
              {this.isSyncScreen ? 'Stop sync' : 'Start sync'}
            </Button>
            {' '}
            <Radio name="screenControlType" inline onChange={this.onControlTypeChange} value="tap"> Tap </Radio> {' '}
            <Radio name="screenControlType" inline onChange={this.onControlTypeChange} value="color"> Color </Radio> {' '}
            <Radio name="screenControlType" inline onChange={this.onControlTypeChange} value="crop"> Crop </Radio>
          </FormGroup>
          <div>x: {this.state.posX}, y: {this.state.posY}</div>
          <img
            src={this.state.syncImageSrc}
            alt="Screenshot here"
            draggable="false"
            onMouseMove={this.onMouseMove}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
          />
        </Panel>
      </div>
    );
  }
}
