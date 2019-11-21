import React, {useRef} from 'react';
import {UPDATE_FILE, UPDATE_VERSION} from '../mutations';
import {MY_PROFILE, GET_STUDY_BY_ID} from '../../state/queries';
import {graphql, compose} from 'react-apollo';
import {EditDocumentForm} from '../forms';
import {fileSortedVersions} from '../utilities';
import {Button, Modal} from 'semantic-ui-react';
import {withAnalyticsTracking} from '../../analyticsTracking';

const EditDocumentModal = ({
  fileNode,
  updateFile,
  updateVersion,
  onCloseDialog,
  study,
  user,
  tracking,
}) => {
  const {
    logEvent,
    EVENT_CONSTANTS: {DOCUMENT},
  } = tracking;
  const formEl = useRef(null);

  const latestVersion = fileSortedVersions(fileNode)[0].node;

  const isAdmin = !user.loading
    ? user.myProfile.roles.includes('ADMIN')
    : false;

  const handleSubmit = async (name, fileType, description, versionStatus) => {
    try {
      await updateFile({
        variables: {kfId: fileNode.kfId, name, description, fileType},
      });
      const updatedVersion = await updateVersion({
        variables: {
          versionId: latestVersion.kfId,
          description: latestVersion.description,
          state: versionStatus,
        },
      });

      logEvent(DOCUMENT.EDIT, {
        updated_version: {
          kfId: updatedVersion.data.updateVersion.version.kfId,
          file_name: updatedVersion.data.updateVersion.version.fileName,
          description: updatedVersion.data.updateVersion.version.description,
          file_status: updatedVersion.data.updateVersion.version.state,
        },
      });
      onCloseDialog();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal open={true} onClose={onCloseDialog} size="small" closeIcon>
      <Modal.Header content="Edit Document Metadata" />
      <Modal.Content scrolling>
        <EditDocumentForm
          ref={formEl}
          tracking={tracking}
          fileNode={{name: fileNode.versions.edges[0].node.fileName}}
          studyFiles={
            study.studyByKfId
              ? study.studyByKfId.files.edges.filter(
                  ({node}) => node.name !== fileNode.name,
                )
              : []
          }
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
            e.preventDefault();
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
  graphql(GET_STUDY_BY_ID, {
    name: 'study',
    options: props => ({variables: {kfId: props.studyId}}),
  }),
  withAnalyticsTracking,
)(EditDocumentModal);
