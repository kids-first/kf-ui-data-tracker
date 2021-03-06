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
      handleDragEnter={handleDragEnter}
      handleDragLeave={handleDragLeave}
      handleDrop={e => {
        e.preventDefault();
        handleUpload(e.dataTransfer.files[0]);
      }}
      handleSelectedFile={e => handleUpload(e.target.files[0])}
      instructions="Drag and drop a file to create a document or update an existing one"
    />
  );
};

UploadContainer.propTypes = {
  /** Function to call after upload, passed the file to be uploaded */
  handleUpload: PropTypes.func.isRequired,
};

export default UploadContainer;
