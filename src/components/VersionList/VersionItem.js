import React from 'react';
import PropTypes from 'prop-types';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../state/mutations';
import AvatarTimeAgo from '../AvatarTimeAgo/AvatarTimeAgo';
import {
  versionState,
  formatFileSize,
  downloadFile,
  lengthLimit,
} from '../../common/fileUtils';
import {Label, Icon, Table} from 'semantic-ui-react';
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
  const labelColor = versionNode.state
    ? versionState[versionNode.state].labelColor
    : 'bg-lightGrey';
  const size = formatFileSize(versionNode.size, true) || 'Size Unknown';
  return (
    <Mutation mutation={FILE_DOWNLOAD_URL}>
      {downloadFileMutation => (
        <Table.Row
          onClick={e => onNameClick(versionNode, index)}
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
              >
                {versionState[versionNode.state].title}
              </Label>
            </Table.Cell>
          ) : (
            <Table.Cell verticalAlign="middle" textAlign="center">
              <Label circular size="mini" empty color={labelColor} />
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

export default VersionItem;
