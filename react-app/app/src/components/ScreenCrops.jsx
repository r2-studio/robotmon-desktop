import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';
import _ from 'lodash';
import fp from 'func-pipe';

import { CScreenCropsEB } from '../modules/event-bus';
import Scripts from './Scripts.jsx';
import Screen from './Screen.jsx';

import {} from '../styles/global.css';

export default class ScreenCrops extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      deviceImages: [],
    };

    this.refresh = this.refresh.bind(this);

    CScreenCropsEB.addListener(CScreenCropsEB.EventAppNameChanged, (appName) => {
      if (this.appName !== appName) {
        this.appName = appName;
        this.refresh();
      }
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
    fp
      .pipe(fp.bind(this.editorClient.client.runScript, scripts))
      .pipe(console.log);
  }

  refresh() {
    this.imagePath = `${this.editorClient.storagePath}/scripts/${this.appName}/images`;
    fp
      .pipe(fp.bind(this.editorClient.client.runScript, `execute('ls ${this.imagePath}');`))
      .pipe(({ message }) => {
        const files = _.filter(message.split('\n'), v => v !== '');
        _.forEach(files, (file) => {
          const filePath = `${this.imagePath}/${file}`;
          this.pullImageBase64(filePath);
        });
      });
  }


  render() {
    return (
      <Panel header="Screen Crop" />

    );
  }
}
