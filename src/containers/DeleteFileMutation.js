import React from 'react';
import PropTypes from 'prop-types';
import {Mutation} from 'react-apollo';
import {GET_STUDY_BY_ID} from '../state/queries';
import {DELETE_FILE} from '../state/mutations';
/**
 * Delete file from study and the study in the cache
 */
const DeleteFileMutation = ({studyId, children}) => {
  return (
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
    >
      {(deleteFile, {loading, error}) =>
        children ? children(deleteFile, {loading, error}) : null
      }
    </Mutation>
  );
};

DeleteFileMutation.propTypes = {
  /** Study kfId*/
  studyId: PropTypes.string.isRequired,
};

export default DeleteFileMutation;
