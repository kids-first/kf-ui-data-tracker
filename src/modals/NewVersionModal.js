import React, {useState} from 'react';
import {Query} from 'react-apollo';
import {GET_FILE_BY_ID} from '../../state/queries';
import {LoadingPlaceholder} from '../Loading';
import UploadContainer from '../../containers/UploadContainer';
import Modal from '../Modal/Modal';

const UploadVersionModalContainer = ({
  studyId,
  fileNode,
  additionalContent,
  onCloseDialog,
}) => {
  const [file, setFile] = useState();
  return (
    <Modal
      title="UPLOAD NEW VERSION"
      onCloseModal={onCloseDialog}
      disableSubmit={!file}
    >
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

export default UploadVersionModalContainer;
