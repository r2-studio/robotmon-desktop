import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class CropImage extends Component {
  static parsePath(filepath) {
    const paths = filepath.split('/');
    const filename = paths[paths.length - 1];
    const appName = paths[paths.length - 3];
    return { filename, appName };
  }

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  static get propTypes() {
    return {
      filepath: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
    };
  }

  render() {
    const pathObj = CropImage.parsePath(this.props.filepath);
    return (
      <div style={{ margin: 5 }}>
        <div >{pathObj.filename}</div>
        <img src={this.props.src} style={{ maxWidth: 200, maxHeight: 200 }} />
      </div>
    );
  }
}
