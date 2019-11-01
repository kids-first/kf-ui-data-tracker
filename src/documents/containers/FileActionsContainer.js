import React from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@apollo/react-hooks';
import {FILE_DOWNLOAD_URL, DELETE_FILE} from '../mutations';
import {GET_STUDY_BY_ID} from '../../state/queries';
import FileActionButtons from '../components/FileActionButtons/FileActionButtons';

const FileActionsContainer = ({node, studyId, fluid, vertical, isAdmin}) => {
  const [downloadFileMutation] = useMutation(FILE_DOWNLOAD_URL);
  const [deleteFile, {loading, error}] = useMutation(DELETE_FILE, {
    refetchQueries: [{query: GET_STUDY_BY_ID, variables: {kfId: studyId}}],
  });
  if (node) {
    return (
      <FileActionButtons
        {...{
          node,
          studyId,
          deleteFile: isAdmin ? deleteFile : null,
          downloadFileMutation,
          loading,
          error,
          vertical,
          fluid,
          eventProperties: {
            file: {studyId, kfId: node.kfId},
            is_admin: isAdmin,
          },
        }}
      />
    );
  }
  return null;
};

FileActionsContainer.propTypes = {
  /** study file object */
  node: PropTypes.object.isRequired,
  /** Kids First unique study identifier (SD_XXXXXXXX) */
  studyId: PropTypes.string.isRequired,
};

FileActionsContainer.defaultProps = {
  /** study file object */
  node: null,
  /** Kids First unique study identifier (SD_XXXXXXXX) */
  studyId: null,
};

export default FileActionsContainer;
