import React, {useState} from 'react';
import {UPDATE_FILE, UPDATE_VERSION} from '../state/mutations';
import {MY_PROFILE} from '../state/queries';
import {graphql, compose} from 'react-apollo';
import {EditDocumentForm} from '../forms';
import {fileSortedVersions} from '../common/fileUtils';
import {Button, Modal} from 'semantic-ui-react';

const EditDocumentModal = ({
  fileNode,
  updateFile,
  updateVersion,
  onCloseDialog,
  user,
}) => {
  const [fileTypeInput, setFileType] = useState(fileNode.fileType);
  const [fileNameInput, setFileName] = useState(fileNode.name);
  const [fileDescriptionInput, setFileDescription] = useState(
    fileNode.description,
  );

  const latestVersion = fileSortedVersions(fileNode)[0].node;
  const [versionStatusInput, setVersionStatus] = useState(latestVersion.state);
  const isAdmin = !user.loading
    ? user.myProfile.roles.includes('ADMIN')
    : false;

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
    <Modal open={true} onClose={onCloseDialog} size="small" closeIcon>
      <Modal.Header content="Edit Document Metadata" />
      <Modal.Content scrolling>
        <EditDocumentForm
          fileType={fileTypeInput}
          fileName={fileNameInput}
          isAdmin={isAdmin}
          fileDescription={fileDescriptionInput}
          versionStatus={versionStatusInput}
          onNameChange={e => setFileName(e.target.value)}
          onDescriptionChange={e => setFileDescription(e.target.value)}
          onFileTypeChange={item => setFileType(item)}
          onVersionStatusChange={versionStatusValue =>
            setVersionStatus(versionStatusValue)
          }
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          size="mini"
          onClick={e => onSubmit(e)}
          disabled={!fileNameInput || !fileTypeInput || !fileDescriptionInput}
        >
          SAVE
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default compose(
  graphql(UPDATE_FILE, {name: 'updateFile'}),
  graphql(UPDATE_VERSION, {name: 'updateVersion'}),
  graphql(MY_PROFILE, {name: 'user'}),
)(EditDocumentModal);
