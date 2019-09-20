import React from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Icon, Popup} from 'semantic-ui-react';
import {downloadFile, createDateSort} from '../../common/fileUtils';
import CopyButton from '../CopyButton/CopyButton';
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
  vertical = true,
  fluid = false,
}) => {
  return (
    <Button.Group fluid={fluid} size="small">
      <CopyButton
        textToCopy={
          node.downloadUrl +
          `/version/${node.versions.edges.sort(createDateSort)[0].node.kfId}`
        }
        icon="share"
        basic="very"
        compact="very"
        tooltip="copy download link"
      />
      <Button
        basic
        compact="very"
        icon="download"
        onClick={e => {
          e.stopPropagation();
          downloadFile(studyId, node.kfId, null, downloadFileMutation);
        }}
      />
      <Popup
        trigger={
          <Button
            basic
            compact="very"
            data-testid="delete-button"
            onClick={e => e.stopPropagation()}
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
              onClick={e => {
                e.stopPropagation();
                deleteFile({variables: {kfId: node.kfId}});
              }}
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
  /** Whether the buttons should be grouped vertically or not */
  vertical: PropTypes.bool,
  /** Whether the buttons should fill their container or not */
  fluid: PropTypes.bool,
};

export default FileActionButtons;
