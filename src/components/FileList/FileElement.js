import React from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import Badge from '../Badge/Badge';
import {Icon, Label, List} from 'semantic-ui-react';
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
    <List.Item>
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
      <Link
        to={`/study/${match.params.kfId}/documents/${fileKfID}`}
        data-testid="edit-file"
      >
        <List.Content>
          <List.Header as="a">{fileName}</List.Header>
          {fileDescription ? <small>{fileDescription}</small> : null}
          <List.Description>
            <List horizontal>
              <List.Item>
                <Label size="tiny" color="pink">
                  <Icon name="database" />
                  {fileKfID}
                </Label>
              </List.Item>
              <List.Item>
                {latestDate ? (
                  <TimeAgo date={latestDate} live={false} />
                ) : (
                  <span>unknown</span>
                )}
              </List.Item>
              <List.Item>Size: {fileSize}</List.Item>
              <List.Item>{fileType}</List.Item>
            </List>
          </List.Description>
        </List.Content>
      </Link>
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
