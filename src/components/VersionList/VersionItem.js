import React from 'react';
import PropTypes from 'prop-types';
import {Mutation} from 'react-apollo';
import {FILE_DOWNLOAD_URL} from '../../state/mutations';
import TimeAgo from 'react-timeago';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {
  versionState,
  formatFileSize,
  downloadFile,
} from '../../common/fileUtils';
import {Label, Icon, List} from 'semantic-ui-react';
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
            <Label.Group size="mini">
              <Label
                ribbon
                as="button"
                color={labelColor}
                onClick={e => onNameClick(versionNode, index)}
              >
                {versionNode.fileName}
              </Label>
              <Label image basic>
                <img
                  alt={
                    versionNode.creator
                      ? versionNode.creator.username
                      : 'unknown'
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
              <CopyToClipboard text={versionNode.kfId}>
                <Label as="button" basic>
                  <Icon name="copy" />
                  {versionNode.kfId}
                </Label>
              </CopyToClipboard>
              {index === 0 && (
                <Label tag color="purple">
                  LATEST
                </Label>
              )}
            </Label.Group>
            <p
              style={{
                marginTop: 0,
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              Change Summary:{' '}
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
