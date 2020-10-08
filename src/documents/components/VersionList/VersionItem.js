import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import {useMutation} from '@apollo/react-hooks';
import {FILE_DOWNLOAD_URL} from '../../mutations';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import AvatarTimeAgo from '../../../components/AvatarTimeAgo/AvatarTimeAgo';
import CopyButton from '../../../components/CopyButton/CopyButton';
import {formatFileSize, downloadFile, lengthLimit} from '../../utilities';
import {Label, Icon, Table, Popup, Button} from 'semantic-ui-react';
/**
 * Displays single version item from the list
 */
const VersionItem = ({
  studyId,
  fileId,
  fileType,
  versionNode,
  index,
  onNameClick,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadFileMutation] = useMutation(FILE_DOWNLOAD_URL);
  const size = versionNode.size
    ? formatFileSize(versionNode.size, true)
    : 'Size Unknown';
  return (
    <Table.Row
      onClick={e => onNameClick(versionNode, index)}
      className="version--item cursor-pointer"
    >
      <Table.Cell>
        <p title={versionNode.fileName}>
          <b>{lengthLimit(versionNode.fileName, 70)}</b>
        </p>
        <p title={versionNode.description} data-testid="version-item">
          <small>
            {lengthLimit(versionNode.description || '', 110)}
            {(!versionNode.description ||
              versionNode.description.length === 0) &&
              'No version summary available'}
          </small>
        </p>
      </Table.Cell>
      <Table.Cell textAlign="right" verticalAlign="top" collapsing>
        <AvatarTimeAgo
          size="mini"
          showUsername
          creator={versionNode.creator}
          createdAt={versionNode.createdAt}
        />
        <br />
        <CopyButton
          data-testid="copy-version-id"
          text={' ' + versionNode.kfId}
          textToCopy={versionNode.kfId}
          basic
          className="smallButton"
          size="mini"
          position="top left"
          tooltip="Copy version ID"
          as={Label}
        />
        <Button.Group basic size="mini">
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
                position="top center"
                content="Preview this Version"
                trigger={
                  <Button
                    className="smallButton"
                    icon="eye"
                    onClick={e => {
                      logEvent('click');
                      e.stopPropagation();
                      window.open(
                        `/study/${studyId}/documents/${fileId}/versions/${versionNode.kfId}`,
                      );
                    }}
                  />
                }
              />
            )}
          </Amplitude>
          <Popup
            inverted
            position="top center"
            icon="download"
            content={'Download this version (' + size + ')'}
            trigger={
              <Button
                className="smallButton"
                icon="download"
                onClick={e => {
                  e.stopPropagation();
                  downloadFile(
                    studyId,
                    fileId,
                    versionNode.kfId,
                    downloadFileMutation,
                  );
                }}
              />
            }
          />
          <Popup
            inverted
            position="top left"
            content={
              copied ? (
                <Icon color="green" name="check" />
              ) : (
                'Copy download link'
              )
            }
            trigger={
              <CopyToClipboard
                text={versionNode.downloadUrl}
                onCopy={() => {
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 700);
                }}
              >
                <Button
                  className="smallButton"
                  icon="copy"
                  onClick={e => e.stopPropagation()}
                />
              </CopyToClipboard>
            }
          />
        </Button.Group>
      </Table.Cell>
    </Table.Row>
  );
};

VersionItem.propTypes = {
  /** Study kfId*/
  studyId: PropTypes.string,
  /** File kfId*/
  fileId: PropTypes.string,
  /** File type*/
  fileType: PropTypes.string,
  /** Version object*/
  versionNode: PropTypes.object.isRequired,
  /** Index of version item (sort by createdAt)*/
  index: PropTypes.number,
};

VersionItem.defaultProps = {
  studyId: null,
  fileId: null,
  fileType: null,
  fileNode: {},
  index: null,
};

export default VersionItem;
