import React, {useState} from 'react';
import {UPDATE_FILE, UPDATE_VERSION} from '../state/mutations';
import {graphql} from 'react-apollo';
import {EditDocumentForm} from '../forms';
import Modal from '../components/Modal/Modal';
import {fileSortedVersions} from '../common/fileUtils';

const EditDocumentModal = ({
  fileNode,
  updateFile,
  updateVersion,
  onCloseDialog,
}) => {
  const [fileTypeInput, setFileType] = useState(fileNode.fileType);
  const [fileNameInput, setFileName] = useState(fileNode.name);
  const [fileDescriptionInput, setFileDescription] = useState(
    fileNode.description,
  );

  const latestVersion = fileSortedVersions(fileNode)[0].node;
  const [versionStatusInput, setVersionStatus] = useState(latestVersion.state);

  const onSubmit = e => {
    e.preventDefault();
    const name = fileNameInput;
    const description = fileDescriptionInput;
    const fileType = fileTypeInput;
    updateFile({variables: {kfId: fileNode.kfId, name, description, fileType}})
      .then(() => onCloseDialog())
      .catch(err => console.log(err));
    updateVersion({
      variables: {
        versionId: latestVersion.kfId,
        description: latestVersion.description,
        state: versionStatusInput,
      },
    })
      .then(() => onCloseDialog())
      .catch(err => console.log(err));
  };

  return (
    <Modal
      title="Edit Document Metadata"
      submitText="SAVE"
      onSubmit={e => onSubmit(e)}
      onCloseModal={onCloseDialog}
    >
      <EditDocumentForm
        fileType={fileTypeInput}
        fileName={fileNameInput}
        fileDescription={fileDescriptionInput}
        versionStatus={versionStatusInput}
        onNameChange={e => setFileName(e.target.value)}
        onDescriptionChange={e => setFileDescription(e.target.value)}
        onFileTypeChange={e => setFileType(e.target.value)}
        onVersionStatusChange={versionStatusValue =>
          setVersionStatus(versionStatusValue)
        }
      />
    </Modal>
  );
};

export default graphql(UPDATE_FILE, {name: 'updateFile'})(
  graphql(UPDATE_VERSION, {name: 'updateVersion'})(EditDocumentModal),
);
