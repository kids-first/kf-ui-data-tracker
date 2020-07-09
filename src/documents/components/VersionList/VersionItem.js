import React from 'react';
import PropTypes from 'prop-types';
import {useMutation} from '@apollo/react-hooks';
import {FILE_DOWNLOAD_URL} from '../../mutations';
import AvatarTimeAgo from '../../../components/AvatarTimeAgo/AvatarTimeAgo';
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
            {lengthLimit(versionNode.description, 110)}
            {versionNode.description.length === 0 &&
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
        <Popup
          inverted
          position="top center"
          icon="download"
          content="Download this Version"
          trigger={
            <Label
              basic
              size="mini"
              as={Button}
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
          }
        />
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
