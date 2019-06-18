import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon} from 'semantic-ui-react';
import {downloadFile} from '../../common/fileUtils';
/**
 * Simple Icon Buttons to download and delete a file passed in as the node prop
 */
const FileActionButtons = ({
  node,
  loading,
  error,
  studyId,
  downloadFileMutation,
  deleteFile,
}) => {
  return (
    <Button.Group vertical size="tiny">
      <Button
        icon
        onClick={e =>
          downloadFile(studyId, node.kfId, null, downloadFileMutation)
        }
      >
        <Icon name="download" />
      </Button>
      <Button
        negative
        icon
        onClick={e => deleteFile({variables: {kfId: node.kfId}})}
      >
        <Icon name="trash alternate" />
      </Button>
    </Button.Group>
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
};

export default FileActionButtons;
