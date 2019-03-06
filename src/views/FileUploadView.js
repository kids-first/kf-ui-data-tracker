import React, { Component } from "react";
import PropTypes from 'prop-types';

import { GridContainer } from '../components/Grid';
import { FileUploadTarget } from '../components/FileUpload';

class FileUploadView extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [] };
  }

  handleDrop = (fileList) => {
    const { files } = this.state;

    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i].name) {
        files.push(fileList[i]);
      }
    }

    this.setState({ files });
  }

  handleSelectedFile = (e) => {
    const { files } = this.state;
    files.push(e.target.files[0]);

    this.setState({ files });
  }

  render() {
    const { files } = this.state;

    return (
      <GridContainer>
        <h3 className="col-12">Upload Study Files & Manifests for DRC Approval</h3>
          {
            files.length 
            ? (
              <ul className="list-reset col-12 border border-grey">
                {files.map(file => (
                  <li className="w-full" key={file.name}>File Name: {file.name} Size: {file.size}</li>
                ))}
              </ul>  
            )
            : null
          }        
        <FileUploadTarget 
          className="my-4"
          instructions="To upload files, drag and drop them here"
          handleSelectedFile={this.handleSelectedFile}
          onDrop={this.handleDrop}
        />
      </GridContainer>
    );
  }
}

FileUploadView.propTypes = {
  /** any additional classes that should be added to the container */
  className: PropTypes.string,
  /** add helpful instruction about how to drag and drop files */
  instructions: PropTypes.string,
  /** operations for selected files */
  handleSelectedFile: PropTypes.func,
  /** operations for dropped files */
  onDrop: PropTypes.func,
};

FileUploadView.defaultProps = {
  className: null,
  instructions: "Drag and drop files here",
  handleSelectedFile: () => {},
  onDrop: () => {},
};

/**
 * @component
 */
export default FileUploadView;
