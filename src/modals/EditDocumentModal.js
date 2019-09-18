import React, {useRef} from 'react';
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
  const formEl = useRef(null);

  const latestVersion = fileSortedVersions(fileNode)[0].node;

  const isAdmin = !user.loading
    ? user.myProfile.roles.includes('ADMIN')
    : false;

  const handleSubmit = (name, fileType, description, versionStatus) => {
    updateFile({variables: {kfId: fileNode.kfId, name, description, fileType}})
      .then(() => onCloseDialog())
      .catch(err => console.log(err));
    updateVersion({
      variables: {
        versionId: latestVersion.kfId,
        description: latestVersion.description,
        state: versionStatus,
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
          ref={formEl}
          fileType={fileNode.fileType}
          fileName={fileNode.name}
          versionStatus={latestVersion.state}
          isAdmin={isAdmin}
          fileDescription={fileNode.description}
          handleSubmit={handleSubmit}
          showFieldHints={false}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          size="mini"
          type="submit"
          onClick={e => {
            formEl.current.handleSubmit();
          }}
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
