import React, {useRef} from 'react';
import {useQuery, useMutation} from '@apollo/client';
import {UPDATE_FILE, UPDATE_VERSION} from '../mutations';
import {GET_STUDY_BY_ID} from '../../state/queries';
import {EditDocumentForm} from '../forms';
import {fileSortedVersions} from '../utilities';
import {Button, Modal} from 'semantic-ui-react';

const EditDocumentModal = ({fileNode, onCloseDialog, studyId}) => {
  const study = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + studyId).toString('base64'),
    },
  });
  const [updateFile] = useMutation(UPDATE_FILE);
  const [updateVersion] = useMutation(UPDATE_VERSION);

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
