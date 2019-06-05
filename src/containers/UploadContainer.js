import React, {useState} from 'react';
import PropTypes from 'prop-types';
import FileUploadTarget from '../components/FileUpload/FileUploadTarget';

/**
 * The UploadContainer tracks file dialog and dragging state for uploads.
 */
const UploadContainer = ({handleUpload}) => {
  const [dragging, setDragging] = useState(false);
  const [count, setCount] = useState(0);

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDragEnter = e => {
    e.preventDefault();
    setCount(count + 1);

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setCount(count - 1);

    if (count === 0) {
      setDragging(false);
    }
  };

  return (
    <FileUploadTarget
      dragging={dragging}
      handleDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      handleDrop={e => handleUpload(e.target.files[0])}
      handleSelectedFile={e => handleUpload(e.target.files[0])}
      instructions="To upload files, drag and drop them here"
    />
  );
};

UploadContainer.propTypes = {
  /** Function to call after upload, passed the file to be uploaded */
  handleUpload: PropTypes.func.isRequired,
};

export default UploadContainer;
