import React, {useRef} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {UPDATE_FILE, UPDATE_VERSION} from '../mutations';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../../state/queries';
import {EditDocumentForm} from '../forms';
import {fileSortedVersions} from '../utilities';
import {Button, Message, Modal} from 'semantic-ui-react';
import {hasPermission} from '../../common/permissions';

const EditDocumentModal = ({fileNode, onCloseDialog, studyId}) => {
  const study = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + studyId).toString('base64'),
    },
  });
  const [updateFile, {loading: fileLoading, error: fileError}] = useMutation(
    UPDATE_FILE,
  );
  const [
    updateVersion,
    {loading: versionLoading, error: versionError},
  ] = useMutation(UPDATE_VERSION);
  // Check if current user is allowed to edit approval status (version state)
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const allowEditVersionStatus =
    myProfile &&
    (hasPermission(myProfile, 'change_version_status') ||
      hasPermission(myProfile, 'change_my_version_status'));

  const formEl = useRef(null);

  const latestVersion = fileSortedVersions(fileNode)[0].node;

  const handleSubmit = async (name, fileType, description, versionStatus) => {
    if (fileNode.name !== name || fileNode.fileType !== fileType) {
      updateFile({
        variables: {kfId: fileNode.kfId, name, fileType},
      })
        .then(resp => onCloseDialog())
        .catch(err => console.log(err));
    }
    if (allowEditVersionStatus && versionStatus !== latestVersion.state) {
      updateVersion({
        variables: {
          versionId: latestVersion.kfId,
          description: latestVersion.description,
          state: versionStatus,
        },
      })
        .then(resp => onCloseDialog())
        .catch(err => console.log(err));
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
            study.data.study
              ? study.data.study.files.edges.filter(
                  ({node}) => node.name !== fileNode.name,
                )
              : []
          }
          fileType={fileNode.fileType}
          fileName={fileNode.name}
          versionStatus={latestVersion.state}
          fileDescription={fileNode.description}
          handleSubmit={handleSubmit}
          allowEditVersionStatus={allowEditVersionStatus}
          validTypes={fileNode.validTypes}
        />
      </Modal.Content>
      <Modal.Actions>
        {versionError && <Message negative content={versionError.message} />}
        {fileError && <Message negative content={fileError.message} />}
        <Button
          primary
          size="mini"
          type="button"
          loading={versionLoading || fileLoading}
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
