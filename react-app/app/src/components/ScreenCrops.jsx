import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';
import _ from 'lodash';
import fp from 'func-pipe';

import { CLogsEB, CScreenCropsEB } from '../modules/event-bus';
import CropImage from './CropImage.jsx';

import {} from '../styles/global.css';

export default class ScreenCrops extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      deviceImages: {},
    };

    this.refresh = this.refresh.bind(this);
    this.pullImageBase64 = this.pullImageBase64.bind(this);
    this.newImage = this.newImage.bind(this);

    CScreenCropsEB.addListener(CScreenCropsEB.EventAppNameChanged, (appName) => {
      if (this.appName !== appName) {
        this.appName = appName;
        this.refresh();
      }
    });

    CScreenCropsEB.addListener(CScreenCropsEB.EventNewImageCropped, (filename) => {
      this.newImage(filename);
    });

    this.appName = '';
    this.imagePath = '';
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
      this.refresh();
    }
  }

  pullImageBase64(filePath) {
    const scripts = `
      var _desktop_open_img = openImage("${filePath}");
      var _desktop_img_base64 = getBase64FromImage(_desktop_open_img);
      releaseImage(_desktop_open_img);
      _desktop_img_base64;
    `;
    return fp
      .pipe(fp.bind(this.editorClient.client.runScript, scripts))
      .pipe(result => result.message)
      .promise();
  }

  newImage(filename) {
    const filePath = `${this.imagePath}/${filename}`;
    return fp
      .pipe(fp.bind(this.pullImageBase64, filePath))
      .pipe((base64) => {
        this.state.deviceImages[filePath] = `data:image/png;base64,${base64}`;
        this.setState({
          deviceImages: this.state.deviceImages,
        });
      })
      .promise();
  }

  // 10.116.221.150
  refresh() {
    CLogsEB.emit(CLogsEB.EventNewLog, CLogsEB.TagDesktop, CLogsEB.LevelInfo, 'Refresh Images...');
    this.setState({
      deviceImages: {},
    });
    this.imagePath = `${this.editorClient.storagePath}/scripts/${this.appName}/images`;
    const fpPromise = fp.pipe(fp.bind(this.editorClient.client.runScript, `execute('ls ${this.imagePath}');`));
    fpPromise.pipe(({ message }) => {
      const filenames = _.filter(message.split('\n'), v => v !== '');
      _.forEach(filenames, (filename) => {
        fpPromise.pipe(fp.bind(this.newImage, filename));
      });
    });
  }

  render() {
    return (
      <div className="panel-container">
        <div className="panel-header">
          Screen Crop
        </div>
        {_.map(this.state.deviceImages, (base64, key) => <CropImage key={key} src={base64} filepath={key} />)}
      </div>
    );
  }
}
