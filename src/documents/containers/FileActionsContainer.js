import React from 'react';
import PropTypes from 'prop-types';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../mutations';
import FileActionButtons from '../components/FileActionButtons/FileActionButtons';
import DeleteFileMutation from './DeleteFileMutation';
const FileActionsContainer = ({node, studyId, fluid, vertical, isAdmin}) => {
  if (node) {
    return (
      <Mutation mutation={FILE_DOWNLOAD_URL} key={node.kfId}>
        {downloadFile => (
          <DeleteFileMutation studyId={studyId}>
            {(deleteFile, {loading, error}) => (
              <FileActionButtons
                {...{
                  node,
                  studyId,
                  deleteFile: isAdmin ? deleteFile : null,
                  downloadFileMutation: downloadFile,
                  loading,
                  error,
                  vertical,
                  fluid,
                }}
                eventProperties={inherit => ({
                  scope: [...inherit.scope, 'FileActionButtons'],
                  file: {studyId, kfId: node.kfId},
                  is_admin: isAdmin,
                })}
              />
            )}
          </DeleteFileMutation>
        )}
      </Mutation>
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
