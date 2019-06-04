import React from 'react';
import PropTypes from 'prop-types';
import UploadContainer from '../containers/UploadContainer';
import Modal from '../components/Modal/Modal';

/**
 * The NewVersionModal handles flow for uploading a new version of a file
 */
const NewVersionModal = ({fileNode, additionalContent, handleClose}) => {
  return (
    <Modal title="UPLOAD NEW VERSION" onCloseModal={handleClose}>
      <p className="font-title mt-0">
        Adding new data or changes to files in your study? You can upload all
        new information here! And you can rest easy knowing that any previous
        versions of your files are automatically archived, and available to you
        for easy download/review at any time.
      </p>
      <p className="font-bold text-sm text-darkGrey">Upload new version of:</p>
      <h3 className="FileTitle">{fileNode.name}</h3>
      <div className="FileDialog--Upload">
        <UploadContainer handleUpload={file => console.log('go to  upload')} />
      </div>
      {additionalContent && additionalContent()}
    </Modal>
  );
};

NewVersionModal.propTypes = {
  /** The file that the new version is being created for */
  fileNode: PropTypes.func.isRequired,
  /** Any additional content to display at the footer */
  additionalContent: PropTypes.func,
  /** Function to be called when the modal should be closed */
  handleClose: PropTypes.func.isRequired,
};

export default NewVersionModal;
