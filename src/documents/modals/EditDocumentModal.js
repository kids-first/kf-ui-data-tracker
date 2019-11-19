import React, {useRef} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {UPDATE_FILE, UPDATE_VERSION} from '../mutations';
import {MY_PROFILE, GET_STUDY_BY_ID} from '../../state/queries';
import {EditDocumentForm} from '../forms';
import {fileSortedVersions} from '../utilities';
import {Button, Modal} from 'semantic-ui-react';

const EditDocumentModal = ({fileNode, onCloseDialog, studyId}) => {
  const study = useQuery(GET_STUDY_BY_ID, {
    variables: {kfId: studyId},
  });
  const user = useQuery(MY_PROFILE);
  const [updateFile] = useMutation(UPDATE_FILE);
  const [updateVersion] = useMutation(UPDATE_VERSION);

  const isAdmin =
    !user.loading && user.data.myProfile
      ? user.data.myProfile.roles.includes('ADMIN')
      : false;

  const formEl = useRef(null);

  const latestVersion = fileSortedVersions(fileNode)[0].node;

  const handleSubmit = async (name, fileType, description, versionStatus) => {
    try {
      await updateFile({
        variables: {kfId: fileNode.kfId, name, description, fileType},
      });
      await updateVersion({
        variables: {
          versionId: latestVersion.kfId,
          description: latestVersion.description,
          state: versionStatus,
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
          fileNode={{name: fileNode.versions.edges[0].node.fileName}}
          studyFiles={
            study.data.studyByKfId
              ? study.data.studyByKfId.files.edges.filter(
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
          type="button"
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

export default EditDocumentModal;
