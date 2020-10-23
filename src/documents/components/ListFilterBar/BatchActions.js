import React from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import {Icon, Button, Segment, Divider, Popup} from 'semantic-ui-react';
import {downloadFile, fileSortedVersions} from '../../utilities';

/**
 * Batch action buttons (download and deleted), disabled when no file selected
 */
const BatchActions = ({
  fileList,
  studyId,
  selection,
  setSelection,
  downloadFileMutation,
  deleteFile,
  disabled,
}) => (
  <Segment
    className="noPadding mt-0 mr-0"
    clearing
    basic
    textAlign="right"
    floated="right"
  >
    <div
      className={disabled ? 'small-inline pr-5 text-gray' : 'small-inline pr-5'}
    >
      {selection.length + '/' + fileList.length + ' selected '}
    </div>
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'button', 'batch preview button']
          : ['button', 'batch preview button'],
      })}
    >
      {({logEvent}) => (
        <Popup
          inverted
          position="top left"
          content="Preview selected documents"
          trigger={
            <Button
              className="h-38"
              compact
              basic
              primary
              size="large"
              icon="eye"
              data-testid="batch-preview"
              disabled={disabled}
              onClick={e => {
                logEvent('click');
                e.stopPropagation();
                selection.map(fileId => {
                  const versionId = fileSortedVersions(
                    fileList.find(({node}) => node.kfId === fileId).node,
                  )[0].node.kfId;
                  return window.open(
                    `/study/${studyId}/documents/${fileId}/versions/${versionId}`,
                  );
                });
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
          ? [...inheritedProps.scope, 'button', 'batch download button']
          : ['button', 'batch download button'],
      })}
    >
      {({logEvent}) => (
        <Popup
          inverted
          position="top left"
          content="Download selected documents"
          trigger={
            <Button
              className="h-38"
              compact
              basic
              primary
              size="large"
              icon="download"
              data-testid="batch-download"
              disabled={disabled}
              onClick={e => {
                logEvent('click');
                e.stopPropagation();
                selection.map(fileId =>
                  downloadFile(studyId, fileId, null, downloadFileMutation),
                );
              }}
            />
          }
        />
      )}
    </Amplitude>
    {deleteFile && (
      <Amplitude
        eventProperties={inheritedProps => ({
          ...inheritedProps,
          scope: inheritedProps.scope
            ? [...inheritedProps.scope, 'button', 'batch delete button']
            : ['button', 'batch delete button'],
        })}
      >
        {({logEvent}) => (
          <Popup
            trigger={
              <Button
                className="h-38"
                compact
                basic
                negative
                size="large"
                icon="trash alternate"
                data-testid="batch-delete"
                disabled={disabled}
                onClick={e => {
                  e.stopPropagation();
                }}
              />
            }
            header="Are you sure?"
            content={
              <>
                These files and all of their versions and history will be
                deleted
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
                    selection.map(fileId =>
                      deleteFile({variables: {kfId: fileId}}),
                    );
                    setSelection([]);
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
  </Segment>
);

export default BatchActions;
