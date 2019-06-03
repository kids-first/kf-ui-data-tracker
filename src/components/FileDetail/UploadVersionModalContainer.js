import React, {useState} from 'react';
import {Query} from 'react-apollo';
import {GET_FILE_BY_ID} from '../../state/queries';
import {LoadingPlaceholder} from '../Loading';
import UploadContainer from '../../containers/UploadContainer';
import FileUploadTarget from '../FileUpload/FileUploadTarget';
import Modal from '../Modal/Modal';

const UploadVersionModalContainer = ({
  studyId,
  fileNode,
  additionalContent,
  onCloseDialog,
}) => {
  const [file, setFile] = useState();
  return (
    <Query query={GET_FILE_BY_ID} variables={{kfId: fileNode.kfId}}>
      {({loading, error, data}) => {
        if (loading) return <LoadingPlaceholder componentName="File Editor" />;
        if (error) return `Error!: ${error}`;
        return (
          <UploadContainer
            studyId={studyId}
            fileId={fileNode.kfId}
            refetchAfterUpload={[
              {
                query: GET_FILE_BY_ID,
                variables: {kfId: fileNode.kfId},
              },
            ]}
          >
            {({
              createFile,
              error,
              dragging,
              handleDragOver,
              handleDragEnter,
              handleDragLeave,
              uploadFile,
            }) => (
              <Modal
                title="UPLOAD NEW VERSION"
                onSubmit={e => uploadFile(file, createFile, onCloseDialog)}
                onCloseModal={onCloseDialog}
                disableSubmit={!file}
              >
                <p className="font-title mt-0">
                  Adding new data or changes to files in your study? You can
                  upload all new information here! And you can rest easy knowing
                  that any previous versions of your files are automatically
                  archived, and available to you for easy download/review at any
                  time.
                </p>
                <p className="font-bold text-sm text-darkGrey">
                  Upload new version of:
                </p>
                <h3 className="FileTitle">{fileNode.name}</h3>
                <div className="FileDialog--Upload">
                  <FileUploadTarget
                    error={error}
                    dragging={dragging}
                    handleDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    handleDrop={e => setFile(e.target.files[0])}
                    handleSelectedFile={e => setFile(e.target.files[0])}
                    instructions="To upload files, drag and drop them here"
                  />
                </div>
                {additionalContent && additionalContent()}
              </Modal>
            )}
          </UploadContainer>
        );
      }}
    </Query>
  );
};

export default UploadVersionModalContainer;
