import React from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Icon, Popup} from 'semantic-ui-react';
import {downloadFile, createDateSort} from '../../utilities';
import CopyButton from '../../../components/CopyButton/CopyButton';
import {Amplitude} from '@amplitude/react-amplitude';

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
}) => (
  <Button.Group fluid={fluid} size="small">
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: [...(inheritedProps.scope || []), 'copy button'],
      })}
    >
      {({logEvent}) => (
        <CopyButton
          textToCopy={
            node.downloadUrl +
            `/version/${node.versions.edges.sort(createDateSort)[0].node.kfId}`
          }
          basic
          compact
          position="top right"
          tooltip="Copy download link"
          onClick={ev => {
            ev.stopPropagation();
            logEvent('download link copied');
          }}
        />
      )}
    </Amplitude>
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: [...(inheritedProps.scope || []), 'download button'],
      })}
    >
      {({logEvent}) => (
        <Popup
          inverted
          position="top right"
          icon="download"
          content="Download latest version"
          trigger={
            <Button
              basic
              compact
              icon="download"
              data-testid="download-file"
              onClick={e => {
                e.stopPropagation();
                logEvent('download file');
                downloadFile(studyId, node.kfId, null, downloadFileMutation);
              }}
            />
          }
        />
      )}
    </Amplitude>
    {deleteFile && vertical && (
      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: [...(inheritedProps.scope || []), 'delete button'],
        })}
      >
        {({logEvent}) => (
          <Popup
            trigger={
              <Button
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
                    e.stopPropagation();
                    logEvent('delete file');
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

const AmplitudeActionButtons = props => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: [...(inheritedProps.scope || []), 'file actions'],
    })}
  >
    <FileActionButtons {...props} />
  </Amplitude>
);

export default AmplitudeActionButtons;
