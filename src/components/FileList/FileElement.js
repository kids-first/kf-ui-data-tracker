import React from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import Badge from '../Badge/Badge';
import {Icon, Label, List, Popup} from 'semantic-ui-react';
import FileActionsContainer from '../../containers/FileActionsContainer';
import {
  fileTypeDetail,
  fileSortedVersions,
  fileLatestDate,
  fileLatestSize,
} from '../../common/fileUtils';
/**
 * Displays unordered study files in list view
 */
const FileElement = ({fileNode, loading, match, fileListId}) => {
  const fileKfID = fileNode.kfId || 'unknown ID';
  const fileName = fileNode.name || 'unknown file name';
  const fileDescription = fileNode.description || null;
  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const fileSize = fileLatestSize(sortedVersions);
  const fileType =
    fileNode && fileTypeDetail[fileNode.fileType]
      ? fileTypeDetail[fileNode.fileType].title
      : 'unknown';
  return (
    <List.Item data-testid="edit-file">
      <List.Content floated="left">
        <Badge
          state={
            sortedVersions.length > 0 ? sortedVersions[0].node.state : null
          }
          loading={loading}
        />
      </List.Content>
      <List.Content floated="right">
        <FileActionsContainer node={fileNode} studyId={fileListId} />
      </List.Content>
      <List.Content>
        <List.Header
          as={Link}
          to={`/study/${match.params.kfId}/documents/${fileKfID}`}
        >
          {fileName}
        </List.Header>
        {fileDescription ? <small>{fileDescription}</small> : null}
        <List.Description>
          <Label.Group size="tiny">
            <Label basic image>
              <img
                src={
                  fileNode.creator
                    ? fileNode.creator.picture
                    : 'https://www.w3schools.com/css/img_avatar.png'
                }
              />
              {fileNode.creator ? fileNode.creator.username : 'Unknown'}
              <Label.Detail>
                {latestDate ? (
                  <TimeAgo date={latestDate} live={false} />
                ) : (
                  'Unknown time'
                )}
              </Label.Detail>
            </Label>
            <Popup
              size="mini"
              inverted
              position="top center"
              content="Download File"
              trigger={
                <Label icon>
                  <Icon name="download" /> {fileSize}
                </Label>
              }
            />
            <Popup
              size="mini"
              inverted
              position="top center"
              content="Copy KF ID"
              trigger={
                <Label as="button" icon>
                  <Icon name="copy" />
                  {fileKfID}
                </Label>
              }
            />
            <Label icon basic>
              <Icon name="hospital" />
              {fileType}
            </Label>
          </Label.Group>
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

FileList.propTypes = {
  /** Array of study object*/
  fileNode: PropTypes.object,
};

FileList.defaultProps = {
  fileNode: null,
};

export default withRouter(FileElement);
