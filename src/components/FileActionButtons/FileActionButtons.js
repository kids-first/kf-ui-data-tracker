import React from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Icon, Popup} from 'semantic-ui-react';
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
    <Button.Group>
      <Button
        icon="download"
        onClick={e => {
          e.stopPropagation();
          downloadFile(studyId, node.kfId, null, downloadFileMutation);
        }}
      />
      <Popup
        trigger={
          <Button
            data-testid="delete-button"
            onClick={e => e.stopPropagation()}
            negative
            icon={<Icon name="trash alternate" />}
          />
        }
        header="Are you sure?"
        content={
          <>
            This file and all of its versions and history will be deleted
            <Divider />
            <Button
              data-testid="delete-confirm"
              negative
              fluid
              icon={<Icon name="trash alternate" />}
              content="Delete"
              onClick={e => deleteFile({variables: {kfId: node.kfId}})}
            />
          </>
        }
        on="click"
        position="top right"
      />
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
