import React, {useState} from 'react';
import PropTypes from 'prop-types';
import FileUploadTarget from '../components/FileUpload/FileUploadTarget';
import {withAnalyticsTracking} from '../../analyticsTracking';

/**
 * The UploadContainer tracks file dialog and dragging state for uploads.
 */
const UploadContainer = ({
  handleUpload,
  tracking: {
    logEvent,
    EVENT_CONSTANTS: {UPLOAD},
  },
}) => {
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
        logEvent(UPLOAD.scope, {
          file: {
            name: e.dataTransfer.files[0].name,
            lastModified: e.dataTransfer.files[0].lastModified,
            lastModifiedDate: e.dataTransfer.files[0].lastModifiedDate,
            type: e.dataTransfer.files[0].type,
            size: e.dataTransfer.files[0].size,
          },
        });
        handleUpload(e.dataTransfer.files[0]);
      }}
      handleSelectedFile={e => handleUpload(e.target.files[0])}
      instructions="To upload Study Documents drag and drop a file here"
      eventProperties={inherit => ({
        scope: [...inherit.scope, 'FileUploadTarget'],
      })}
    />
  );
};

UploadContainer.propTypes = {
  /** Function to call after upload, passed the file to be uploaded */
  handleUpload: PropTypes.func.isRequired,
};

export default withAnalyticsTracking(UploadContainer);
