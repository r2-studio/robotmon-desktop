import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {} from '../styles/global.css';

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
      <div>
        <img src={this.props.src} />
        <div>Path: {this.props.filepath}</div>
        <div>RBM:
          <pre>
            rbm.findImage(&quot;{pathObj.filename}&quot;);<br />
            rbm.imageExists(&quot;{pathObj.filename}&quot;);<br />
            rbm.imageClick(&quot;{pathObj.filename}&quot;);<br />
            rbm.imageWaitClick(&quot;{pathObj.filename}&quot;, 5000);<br />
            rbm.imageWaitShow(&quot;{pathObj.filename}&quot;, 5000);<br />
            rbm.imageWaitGone(&quot;{pathObj.filename}&quot;, 5000);<br />
          </pre>
        </div>
      </div>
    );
  }
}
