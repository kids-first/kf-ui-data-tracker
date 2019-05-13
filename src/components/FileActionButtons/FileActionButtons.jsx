import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {KF_STUDY_API} from '../../common/globals';
import {Icon} from 'kf-uikit';

/**
 * Simple Icon Buttons to download and delete a file passed in as the node prop
 */
const FileActionButtons = ({
  node,
  loading,
  error,
  studyId,
  downloadFile,
  deleteFile,
  className,
  buttonClass,
}) => {
  const FileActionsClass = classes(
    'FileActions',
    {'cursor-not-allowed': loading || error},
    className,
  );
  const FileActionButton = classes('FileActions-Button', buttonClass);

  return (
    <div className={FileActionsClass}>
      <button
        className={FileActionButton}
        onClick={e => {
          downloadFile({
            variables: {studyId, fileId: node.kfId},
          }).then(resp => {
            const url = `${KF_STUDY_API}${resp.data.signedUrl.url}`;
            window.location.href = url;
          });
        }}
      >
        <Icon color="black" width={16} height={16} kind="download" />
      </button>
      <button
        className={FileActionButton}
        onClick={e => deleteFile({variables: {kfId: node.kfId}})}
      >
        <Icon width={16} height={16} kind="delete" />
      </button>
    </div>
  );
};

FileActionButtons.propTypes = {
  /** study file object */
  node: PropTypes.object.isRequired,
  /** loading state */
  loading: PropTypes.bool,
  /** graphQL errors */
  error: PropTypes.object,
  /** Kids First unique study identifier (SD_XXXXXXXX) */
  studyId: PropTypes.string.isRequired,
  /** Action to delete a file */
  deleteFile: PropTypes.func,
  /** Action to download a file */
  downloadFile: PropTypes.func,
  /** additional classes to add to the container element */
  className: PropTypes.string,
  /** additional classes to add to the buttons */
  buttonClass: PropTypes.string,
};

export default FileActionButtons;
