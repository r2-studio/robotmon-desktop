import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormControl, Button, Radio, Modal } from 'react-bootstrap';
import _ from 'lodash';
import fp from 'func-pipe';
import pref from 'electron-pref';

import electron from 'electron';

import { CScreenCropsEB, CLogsEB } from '../modules/event-bus';

const defaultRBMInitSettings = `importJS('RBM-0.0.2');
var _desktop_config = {
  appName: 'com.my.newProject',
  oriResizeFactor: 0.8,
  oriScreenWidth: __replace_width__,
  oriScreenHeight: __replace_height__,
  resizeFactor: 0.8,
  imageThreshold: 0.95,
};
var _desktop_rbm = new RBM(_desktop_config);
_desktop_rbm.init();
`;

const settings = pref.from({
  rbmInitSetting: defaultRBMInitSettings,
});

const lineStyle = {
  pointerEvents: 'none',
  backgroundColor: 'black',
  position: 'absolute',
  width: 1,
  height: 1,
  left: 0,
  top: 0,
};

const rectStyle = {
  pointerEvents: 'none',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'red',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  position: 'absolute',
  width: 0,
  height: 0,
  left: 0,
  top: 0,
};

export default class Screen extends Component {
  static findAppName(intiScripts) {
    const findAppName = intiScripts.match(/appName.*'(.*)'/);
    let appName = '';
    if (findAppName !== null) {
      [_, appName] = findAppName;
    }
    return appName;
  }

  constructor(props) {
    super(props);
    this.state = {
      syncDelay: 800,
      syncImageSize: 600,
      syncQuality: 90,
      syncImageSrc: '',
      posX: 0,
      posY: 0,
      lineRowXY: {},
      lineColXY: {},
      rectXY: { top: 0, left: 0 },
      cropFilename: '',
      rbmSettingModal: false,
      rbmSetting: settings.get('rbmInitSetting'),
      isCropSettingShow: false,
    };
    this.onSyncScreenClick = this.onSyncScreenClick.bind(this);
    this.onControlTypeChange = this.onControlTypeChange.bind(this);
    this.syncScreen = this.syncScreen.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onCropClick = this.onCropClick.bind(this);
    this.onRBMSettingChange = this.onRBMSettingChange.bind(this);
    this.onRBMSettingSave = this.onRBMSettingSave.bind(this);
    this.onRBMResetDefault = this.onRBMResetDefault.bind(this);
    this.onRBMSettingClose = this.onRBMSettingClose.bind(this);
    this.onCropFilenameChange = this.onCropFilenameChange.bind(this);
    this.onCropSettingClick = this.onCropSettingClick.bind(this);

    this.isSyncScreen = false;
    this.screenWidth = 0;
    this.screenHeight = 0;
    this.screenControlType = '';
    this.isMouseDown = false;
    this.syncScreenId = setInterval(this.syncScreen, this.state.syncDelay);
    this.editorClient = undefined;
    this.appName = Screen.findAppName(this.state.rbmSetting);
  }

  static get defaultProps() {
    return {
      editorClient: undefined,
    };
  }

  static get propTypes() {
    return {
      editorClient: PropTypes.object,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.editorClient = nextProps.editorClient;
    if (!_.isUndefined(this.editorClient)) {
      this.state.syncImageSrc = '';
    }
  }

  componentDidUpdate() {
    CScreenCropsEB.emit(CScreenCropsEB.EventAppNameChanged, this.appName);
  }

  onSyncScreenClick() {
    if (this.isSyncScreen) {
      this.isSyncScreen = false;
    } else {
      this.isSyncScreen = true;
    }
    this.forceUpdate();
  }

  onControlTypeChange(e) {
    this.screenControlType = e.target.value;
    this.setState({
      isCropSettingShow: this.screenControlType === 'crop',
    });
  }

  onMouseMove(e) {
    const imgW = e.target.width;
    const imgH = e.target.height;
    if (imgW <= 0 && imgH <= 0) {
      return;
    }
    const posX = Math.floor((e.nativeEvent.offsetX / imgW) * this.screenWidth);
    const posY = Math.floor((e.nativeEvent.offsetY / imgH) * this.screenHeight);
    this.setState({
      posX,
      posY,
      lineRowXY: { width: imgW, top: e.nativeEvent.offsetY },
      lineColXY: { height: imgH, left: e.nativeEvent.offsetX },
    });
    if (this.screenControlType === 'tap') {
      this.editorClient.client.moveTo(posX, posY, 50);
    } else if (this.screenControlType === 'crop') {
      if (!this.isMouseDown) {
        return;
      }
      this.setState({
        rectXY: {
          top: this.state.rectXY.top,
          left: this.state.rectXY.left,
          height: e.nativeEvent.offsetY - this.state.rectXY.top,
          width: e.nativeEvent.offsetX - this.state.rectXY.left,
        },
      });
    }
  }

  onMouseDown(e) {
    this.isMouseDown = true;
    const imgW = e.target.width;
    const imgH = e.target.height;
    if (imgW <= 0 && imgH <= 0) {
      return;
    }
    const posX = Math.floor((e.nativeEvent.offsetX / imgW) * this.screenWidth);
    const posY = Math.floor((e.nativeEvent.offsetY / imgH) * this.screenHeight);
    if (this.screenControlType === 'tap') {
      this.editorClient.client.tapDown(posX, posY, 50);
    } else if (this.screenControlType === 'crop') {
      this.setState({
        rectXY: {
          top: e.nativeEvent.offsetY,
          left: e.nativeEvent.offsetX,
          width: 0,
          height: 0,
        },
      });
    }
  }

  onMouseUp(e) {
    this.isMouseDown = false;
    const imgW = e.target.width;
    const imgH = e.target.height;
    if (imgW <= 0 && imgH <= 0) {
      return;
    }
    const posX = Math.floor((e.nativeEvent.offsetX / imgW) * this.screenWidth);
    const posY = Math.floor((e.nativeEvent.offsetY / imgH) * this.screenHeight);
    if (this.screenControlType === 'tap') {
      this.editorClient.client.tapUp(posX, posY, 50);
    } else if (this.screenControlType === 'color') {
      const scripts = `
        var _screen_image = getScreenshot();
        var _screen_color = getImageColor(_screen_image, ${posX}, ${posY});
        releaseImage(_screen_image);
        JSON.stringify(_screen_color);
      `;
      fp
        .pipe(fp.bind(this.editorClient.client.runScript, scripts))
        .pipe((result) => {
          const color = JSON.parse(result.message);
          const message = `x: ${posX}, y: ${posY}, r: ${color.r}, g: ${color.g}, b: ${color.b}`;
          const style = { backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` };
          CLogsEB.emit(CLogsEB.EventNewLog, this.editorClient.ip, CLogsEB.LevelInfo, message, style);
        });
    }
  }

  onCropFilenameChange(e) {
    this.setState({ cropFilename: e.target.value });
  }

  onCropClick() {
    const ratio = this.state.syncImageSize / Math.max(this.screenWidth, this.screenHeight);
    const posX1 = Math.floor(this.state.rectXY.left / ratio);
    const posY1 = Math.floor(this.state.rectXY.top / ratio);
    const posX2 = Math.floor((this.state.rectXY.left + this.state.rectXY.width) / ratio);
    const posY2 = Math.floor((this.state.rectXY.top + this.state.rectXY.height) / ratio);
    if (posX2 - posX1 > 0 && posY2 - posY1 > 0) {
      if (this.state.cropFilename !== '') {
        const intiScripts = this.state.rbmSetting.replace('__replace_width__', this.screenWidth).replace('__replace_height__', this.screenHeight);
        const scripts = `${intiScripts}_desktop_rbm.screencrop('${this.state.cropFilename}', ${posX1}, ${posY1}, ${posX2}, ${posY2});`;
        fp
          .pipe(fp.bind(this.editorClient.client.runScript, scripts))
          .pipe(() => {
            CScreenCropsEB.emit(CScreenCropsEB.EventNewImageCropped, this.state.cropFilename);
          })
          .catch(console.log);
      }
    }
  }

  // Modal Event
  onCropSettingClick() {
    this.setState({ rbmSettingModal: true });
  }

  onRBMSettingChange(e) {
    this.setState({ rbmSetting: e.target.value });
  }

  onRBMResetDefault() {
    this.setState({ rbmSetting: defaultRBMInitSettings });
  }

  onRBMSettingClose() {
    this.setState({ rbmSettingModal: false, rbmSetting: settings.get('rbmInitSetting') });
    this.appName = Screen.findAppName(this.state.rbmSetting);
    CScreenCropsEB.emit(CScreenCropsEB.EventAppNameChanged, this.appName);
  }

  onRBMSettingSave() {
    settings.set('rbmInitSetting', this.state.rbmSetting);
    this.setState({ rbmSettingModal: false });
  }

  syncScreen() {
    if (!_.isUndefined(this.editorClient) && this.editorClient.isConnect && this.isSyncScreen) {
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
      <div className="panel-container">
        <div className="panel-header">
          Screen Controller
        </div>
        <div className="vertical-container" style={{ margin: '10px 5px 0px 5px' }}>
          <Radio className="vertical-content" name="screenControlType" inline onChange={this.onControlTypeChange} value="tap">Tap</Radio>
          <Radio className="vertical-content" name="screenControlType" inline onChange={this.onControlTypeChange} value="color">Color</Radio>
          <Radio className="vertical-content" name="screenControlType" inline onChange={this.onControlTypeChange} value="crop">Crop</Radio>
          <Button
            className="vertical-content pull-right"
            onClick={this.onSyncScreenClick}
            bsClass={this.isSyncScreen ? 'button-red' : 'button-green'}
          >
            {this.isSyncScreen ? 'Stop Sync' : 'Start Sync'}
          </Button>
        </div>

        {this.state.isCropSettingShow && (
        <Row className="vertical-container" style={{ margin: '10px 5px -10px -10px' }}>
          <Col sm={6} className="vertical-content">
            <FormControl bsClass="input" style={{ width: '115%', padding: '5px' }} type="text" placeholder="ImageName.png" value={this.state.cropFilename} onChange={this.onCropFilenameChange} />
          </Col>
          <Col sm={3} className="vertical-content">
            <Button bsClass="button" onClick={this.onCropSettingClick}>Config</Button>
          </Col>
          <Col sm={3} className="vertical-content">
            <Button bsClass="button-green" onClick={this.onCropClick}>Crop</Button>
          </Col>
        </Row>
        )}

        <div>x: {this.state.posX}, y: {this.state.posY}</div>
        <div style={{ position: 'relative' }}>
          <img
            style={{ maxWidth: 300 }}
            src={this.state.syncImageSrc}
            draggable="false"
            onMouseMove={this.onMouseMove}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
          />
          <div style={Object.assign({}, lineStyle, this.state.lineRowXY)} />
          <div style={Object.assign({}, lineStyle, this.state.lineColXY)} />
          <div style={Object.assign({}, rectStyle, this.state.rectXY)} />
        </div>

        <Modal
          show={this.state.rbmSettingModal}
          onHide={this.onRBMSettingClose}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">RBM Start Settings (For Crop Function)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          Crop function will use RBM library to crop images. Using _desktop_rbm object.<br />
          Save path: /sdcard/Robotmon/scripts/[appName]/images
          <FormControl componentClass="textarea" value={this.state.rbmSetting} onChange={this.onRBMSettingChange} rows="12" />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onRBMResetDefault}>Reset Default</Button>
            <Button onClick={this.onRBMSettingClose}>Close</Button>
            <Button onClick={this.onRBMSettingSave} bsStyle="primary">Change settings</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
