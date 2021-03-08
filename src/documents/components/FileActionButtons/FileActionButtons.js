import React from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import {Button, Divider, Icon, Popup, Responsive} from 'semantic-ui-react';
import {downloadFile, fileSortedVersions} from '../../utilities';
import CopyButton from '../../../components/CopyButton/CopyButton';
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
  hideCopy = false,
  version = null,
}) => {
  return (
    <Button.Group fluid={fluid} size="small">
      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: inheritedProps.scope
            ? [...inheritedProps.scope, 'button', 'preview button']
            : ['button', 'preview button'],
        })}
      >
        {({logEvent}) => (
          <Popup
            inverted
            position="top left"
            content={version ? 'Preview version' : 'Preview latest version'}
            trigger={
              <Button
                basic
                compact
                icon="eye"
                onClick={e => {
                  logEvent('click');
                  e.stopPropagation();
                  e.preventDefault();
                  window.open(
                    `/study/${studyId}/documents/${node.kfId}/versions/${
                      version
                        ? version.kfId
                        : fileSortedVersions(node)[0].node.kfId
                    }`,
                  );
                }}
              />
            }
          />
        )}
      </Amplitude>
      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: inheritedProps.scope
            ? [...inheritedProps.scope, 'button', 'download button']
            : ['button', 'download button'],
        })}
      >
        {({logEvent}) => (
          <Popup
            inverted
            position="top left"
            icon="download"
            content={version ? 'Download version' : 'Download latest version'}
            trigger={
              <Button
                as="a"
                href={
                  node.downloadUrl +
                  `/version/${
                    version
                      ? version.kfId
                      : fileSortedVersions(node)[0].node.kfId
                  }`
                }
                basic
                compact
                icon="download"
                data-testid="download-file"
                onClick={e => {
                  logEvent('click');
                  e.stopPropagation();
                  e.preventDefault();
                  downloadFile(
                    studyId,
                    node.kfId,
                    version && version.kfId,
                    downloadFileMutation,
                  );
                }}
              />
            }
          />
        )}
      </Amplitude>
      {!hideCopy && (
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'button', 'copy ID button']
              : ['button', 'copy ID button'],
          })}
        >
          {({logEvent}) => (
            <CopyButton
              data-testid="copy-file-id"
              textToCopy={
                node.downloadUrl +
                `/version/${
                  version ? version.kfId : fileSortedVersions(node)[0].node.kfId
                }`
              }
              basic
              compact
              position="top left"
              tooltip="Copy download link"
              onClick={e => {
                logEvent('click');
                e.stopPropagation();
              }}
            />
          )}
        </Amplitude>
      )}
      {deleteFile && (
        <Amplitude
          eventProperties={inheritedProps => ({
            ...inheritedProps,
            scope: inheritedProps.scope
              ? [...inheritedProps.scope, 'button', 'delete button']
              : ['button', 'delete button'],
          })}
        >
          {({logEvent}) => (
            <Popup
              trigger={
                <Responsive
                  as={Button}
                  minWidth={Responsive.onlyTablet.minWidth}
                  basic
                  compact
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
                      logEvent('click');
                      e.stopPropagation();
                      deleteFile({variables: {kfId: node.kfId}});
                    }}
                  />
                </>
              }
              on="click"
              position="top right"
            />
          )}
        </Amplitude>
      )}
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
  downloadFileMutation: PropTypes.func,
  /** Whether the buttons should be grouped vertically or not */
  vertical: PropTypes.bool,
  /** Whether the buttons should fill their container or not */
  fluid: PropTypes.bool,
};

export default FileActionButtons;
