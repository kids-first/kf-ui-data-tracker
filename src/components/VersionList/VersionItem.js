import React from 'react';
import PropTypes from 'prop-types';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../state/mutations';
import AvatarTimeAgo from '../AvatarTimeAgo/AvatarTimeAgo';
import CopyButton from '../CopyButton/CopyButton';
import {
  versionState,
  formatFileSize,
  downloadFile,
} from '../../common/fileUtils';
import {Label, Icon, List, Header} from 'semantic-ui-react';
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
        <List.Item onClick={e => onNameClick(versionNode, index)}>
          <List.Icon name="circle" color={labelColor} verticalAlign="middle" />
          <List.Content>
            <Header size="tiny" as="button" className="list--header-inline">
              {versionNode.fileName}
            </Header>
            {index === 0 && (
              <Label tag color="purple" size="mini">
                LATEST
              </Label>
            )}
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
            <CopyButton
              basic
              size="mini"
              text={versionNode.kfId}
              className="micro-button"
            />
            <List.Description>
              <small data-testid="version-item">
                <b>Change Summary: </b>
                {versionNode.description.length > 90
                  ? versionNode.description.substring(0, 90) + '...'
                  : versionNode.description}
                {versionNode.description.length === 0 &&
                  'No version summary available'}
              </small>
            </List.Description>
          </List.Content>
        </List.Item>
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
