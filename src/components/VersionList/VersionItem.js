import React from 'react';
import PropTypes from 'prop-types';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../state/mutations';
import TimeAgo from 'react-timeago';
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
        <List.Item>
          <List.Content>
            <Label
              circular
              empty
              size="mini"
              color={labelColor}
              style={{marginRight: 15}}
            />
            <Header
              as="button"
              onClick={e => onNameClick(versionNode, index)}
              style={{
                display: 'inline-block',
                fontSize: 16,
                paddingRight: 20,
              }}
            >
              {versionNode.fileName}
            </Header>
            {index === 0 && (
              <Label tag color="purple" size="mini">
                LATEST
              </Label>
            )}
            <Label image basic size="mini">
              <img
                alt={
                  versionNode.creator ? versionNode.creator.username : 'unknown'
                }
                src={
                  versionNode.creator.picture
                    ? versionNode.creator.picture
                    : 'https://www.w3schools.com/css/img_avatar.png'
                }
              />
              <TimeAgo date={versionNode.createdAt} live={false} />
            </Label>
            <Label
              basic
              size="mini"
              as="button"
              onClick={e =>
                downloadFile(
                  studyId,
                  fileId,
                  versionNode.kfId,
                  downloadFileMutation,
                )
              }
            >
              <Icon name="download" />
              {size}
            </Label>
            <CopyButton
              basic
              size="mini"
              text={versionNode.kfId}
              style={{
                paddingTop: 7,
                paddingBottom: 7,
                fontSize: 10,
                marginLeft: 2,
              }}
            />
            <p
              style={{
                marginTop: 4,
                marginLeft: 24,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                fontSize: 12,
              }}
              data-testid="version-item"
            >
              <b>Change Summary: </b>
              {versionNode.description || 'No version summary available'}
            </p>
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
