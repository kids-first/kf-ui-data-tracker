import React, { Component } from "react";
import classes from 'classnames';
import PropTypes from 'prop-types';

class FileUploadTarget extends Component {
  constructor(props) {
    super(props);
    this.state = { dragging: false, count: 0 };
  }

  preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  handleDragOver = (e) => {
    this.preventDefaults(e);
  }

  handleDragEnter = (e) => {
    this.preventDefaults(e);
    let { count } = this.state;
    this.setState({ count: ++count });

    if (
      e.dataTransfer.items 
      && e.dataTransfer.items.length > 0
    ) {
      this.setState({ dragging: true });
    }
  }

  handleDragLeave = (e) => {
    this.preventDefaults(e);
    let { count } = this.state;
    this.setState({ count: --count });

    if (this.state.count === 0) {
      this.setState({ dragging: false });
    }
  }

  handleDrop = (e) => {
    this.preventDefaults(e);
    this.setState({ dragging: false });

    if (
      e.dataTransfer.files 
      && e.dataTransfer.files.length > 0
    ) {
      this.props.onDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      this.setState({ count: 0 });
    }
  }

  render() {
    const { className, instructions, handleSelectedFile } = this.props;
    const { handleDragOver, handleDragEnter, handleDragLeave, handleDrop } = this;
    const fileUploadFormClass = classes(
      'upload-target',
      'w-full',
      'p-12',
      'bg-lightGrey',
      'border-grey',
      'border-2',
      'border-dashed',
      'text-center',
      className
    );

    return (
      <form 
        className={fileUploadFormClass} 
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
      {
        instructions 
        ? (
        <p className="max-w-full pt-0 pb-4 mt-0">
          {instructions}<br /><small className="m-0 p-0"><i>or</i></small>
        </p>
        )
        : null
      }
        <input
          type="file" 
          class="Button Button--default" 
          onChange={handleSelectedFile} 
        />  
      </form>
    );
  }
}

FileUploadTarget.propTypes = {
  /** any additional classes that should be added to the container */
  className: PropTypes.string,
  /** add helpful instruction about how to drag and drop files */
  instructions: PropTypes.string,
  /** operations for selected files */
  handleSelectedFile: PropTypes.func,
};

FileUploadTarget.defaultProps = {
  className: null,
  instructions: "Drag and drop Files here",
  handleSelectedFile: () => {},
};

/**
 * @component
 */
export default FileUploadTarget;
