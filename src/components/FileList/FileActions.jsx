import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {Mutation} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../../state/queries';
import {DELETE_FILE, FILE_DOWNLOAD_URL} from '../../state/mutations';
import {KF_STUDY_API} from '../../common/globals';
import {Icon} from 'kf-uikit';

const FileActions = ({node, studyId, className}) => {
  const FileActionsClass = classes('FileActions', className);

  const FileActionButton = classes('FileActionButton');
  if (node) {
    return (
      <Mutation mutation={FILE_DOWNLOAD_URL} key={node.kfId}>
        {downloadFile => (
          <Mutation
            mutation={DELETE_FILE}
            update={(cache, {data: {deleteFile}}) => {
              // Re-writes the study in the cache with the deleted file
              // removed.
              const {studyByKfId} = cache.readQuery({
                query: GET_STUDY_BY_ID,
                variables: {kfId: studyId},
              });
              const deleteIndex = studyByKfId.files.edges.findIndex(
                edge => edge.node.kfId === deleteFile.kfId,
              );
              if (deleteIndex < 0) {
                return studyByKfId;
              }
              studyByKfId.files.edges.splice(deleteIndex, 1);
              const data = {
                studyByKfId: {
                  ...studyByKfId,
                  files: {
                    __typename: 'FileNodeConnection',
                    edges: studyByKfId.files.edges,
                  },
                },
              };
              cache.writeQuery({
                query: GET_STUDY_BY_ID,
                data,
              });
            }}
            key={node.kfId}
          >
            {(deleteFile, {loading, error}) => (
              <FileActionButtons
                {...{
                  node,
                  studyId,
                  deleteFile,
                  downloadFile,
                  loading,
                  className,
                  error,
                }}
              />
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
  return null;
};

export default FileActions;
