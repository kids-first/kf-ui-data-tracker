import React from 'react';
import PropTypes from 'prop-types';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../mutations';
import AvatarTimeAgo from '../../../components/AvatarTimeAgo/AvatarTimeAgo';
import {formatFileSize, downloadFile, lengthLimit} from '../../utilities';
import {versionState} from '../../../common/enums';
import {Label, Icon, Table, Popup} from 'semantic-ui-react';
import {withAnalyticsTracking} from '../../../analyticsTracking';
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
  tracking: {
    EVENT_CONSTANTS: {DOCUMENT_VERSION_},
    buttonTracking,
    instrument,
  },
}) => {
  const labelColor = versionNode.state
    ? versionState[versionNode.state].labelColor
    : 'grey';
  const size = versionNode.size
    ? formatFileSize(versionNode.size, true)
    : 'Size Unknown';
  return (
    <Mutation mutation={FILE_DOWNLOAD_URL}>
      {downloadFileMutation => (
        <Table.Row
          {...buttonTracking(
            versionNode.fileName,
            'Table.Row',
            {
              document_version: {
                kfId: versionNode.kfId,
                file_name: versionNode.fileName,
                state: versionNode.state,
              },
            },
            DOCUMENT_VERSION_.scope + 'item',
          )}
          onClick={e => {
            onNameClick(versionNode, index);
            buttonTracking(
              versionNode.fileName,
              'Table.Row',
              {
                document_version: {
                  kfId: versionNode.kfId,
                  file_name: versionNode.fileName,
                  state: versionNode.state,
                },
              },
              DOCUMENT_VERSION_.scope + 'item',
            ).onClick();
          }}
          className="version--item"
        >
          {index === 0 ? (
            <Table.Cell collapsing>
              <Label
                color={labelColor}
                basic
                size="tiny"
                ribbon
                title="Latest Version"
                onClick={() =>
                  buttonTracking(
                    DOCUMENT_VERSION_.scope + 'STATE',
                    'label',
                    {
                      document_version: {
                        kfId: versionNode.kfId,
                        file_name: versionNode.fileName,
                        state: versionNode.state,
                      },
                    },
                    DOCUMENT_VERSION_.scope + 'STATE',
                  ).onClick()
                }
              >
                {versionNode.state
                  ? versionState[versionNode.state].title
                  : 'Unknown'}
              </Label>
            </Table.Cell>
          ) : (
            <Table.Cell verticalAlign="middle" textAlign="center">
              <Popup
                inverted
                position="left center"
                size="small"
                content={
                  versionNode.state
                    ? versionState[versionNode.state].title
                    : 'Unknown'
                }
                key={versionNode.state}
                trigger={
                  <Label circular size="mini" empty color={labelColor} />
                }
              />
            </Table.Cell>
          )}

          <Table.Cell>
            <p title={versionNode.fileName}>
              <b>{lengthLimit(versionNode.fileName, 70)}</b>
            </p>
            <p title={versionNode.description} data-testid="version-item">
              <small>
                {lengthLimit(versionNode.description, 110)}
                {versionNode.description.length === 0 &&
                  'No version summary available'}
              </small>
            </p>
          </Table.Cell>
          <Table.Cell textAlign="right" verticalAlign="top" collapsing>
            <AvatarTimeAgo
              size="mini"
              creator={versionNode.creator}
              createdAt={versionNode.createdAt}
            />
            <Label
              basic
              size="mini"
              as="button"
              onClick={e => {
                e.stopPropagation();

                buttonTracking(
                  size,
                  'icon button',
                  {
                    document_version: {
                      kfId: versionNode.kfId,
                      file_name: versionNode.fileName,
                      state: versionNode.state,
                    },
                  },
                  DOCUMENT_VERSION_.scope + 'SIZE',
                ).onClick();
                downloadFile(
                  studyId,
                  fileId,
                  versionNode.kfId,
                  downloadFileMutation,
                );
              }}
            >
              <Icon name="download" />
              {size}
            </Label>
          </Table.Cell>
        </Table.Row>
      )}
    </Mutation>
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

export default withAnalyticsTracking(VersionItem);
