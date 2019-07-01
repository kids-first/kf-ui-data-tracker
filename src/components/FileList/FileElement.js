import React from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import Badge from '../Badge/Badge';
import {Header, Table, Icon, List, Responsive} from 'semantic-ui-react';
import CopyButton from '../CopyButton/CopyButton';
import FileActionsContainer from '../../containers/FileActionsContainer';
import {
  fileTypeDetail,
  fileSortedVersions,
  fileLatestDate,
  fileLatestSize,
} from '../../common/fileUtils';

/**
 * Displays a list of file attributes
 */
const FileAttributes = ({
  fileKfID,
  latestDate,
  fileSize,
  fileType,
  horizontal,
}) => (
  <List bulleted={horizontal} horizontal={horizontal}>
    <List.Item>
      <CopyButton basic size="mini" text={fileKfID} />
    </List.Item>
    <List.Item>
      <List.Description>
        {latestDate ? (
          <>
            Created <TimeAgo date={latestDate} live={false} />
          </>
        ) : (
          'Unknown time'
        )}
      </List.Description>
    </List.Item>
    <List.Item>
      <List.Description>{fileSize}</List.Description>
    </List.Item>
    <List.Item>
      <Icon name="hospital" />
      {fileType}
    </List.Item>
  </List>
);

FileAttributes.propTypes = {
  /** The kf id of the file */
  fileKfID: PropTypes.string.isRequired,
  /** The date of last modification */
  latestDate: PropTypes.string.isRequired,
  /** The size of the file */
  fileSize: PropTypes.string.isRequired,
  /** The type of file */
  fileType: PropTypes.string.isRequired,
  /** Whether the list should be displayed horizontally */
  horizontal: PropTypes.bool,
};

FileAttributes.defaultProps = {
  horizontal: false,
};

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
    <Table.Row>
      <Table.Cell singleLine collapsing textAlign="center">
        <Badge
          state={
            sortedVersions.length > 0 ? sortedVersions[0].node.state : null
          }
          loading={loading}
        />
      </Table.Cell>
      <Table.Cell>
        <Link
          style={{display: 'block', width: '100%'}}
          to={`/study/${match.params.kfId}/documents/${fileKfID}`}
        >
          <Header size="medium" as="span">
            {fileName}
          </Header>
          <p
            style={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {fileDescription ? (
              <>
                {fileDescription.length > 100
                  ? fileDescription.substring(0, 100) + '...'
                  : fileDescription}
              </>
            ) : null}
          </p>
        </Link>
        <Responsive
          as={FileAttributes}
          minWidth={Responsive.onlyTablet.maxWidth}
          fileKfID={fileKfID}
          latestDate={latestDate}
          fileSize={fileSize}
          fileType={fileType}
          horizontal={true}
        />
        <Responsive
          as={FileAttributes}
          maxWidth={Responsive.onlyTablet.maxWidth}
          fileKfID={fileKfID}
          latestDate={latestDate}
          fileSize={fileSize}
          fileType={fileType}
          horizontal={false}
        />
      </Table.Cell>
      <Table.Cell collapsing textAlign="right">
        <FileActionsContainer node={fileNode} studyId={fileListId} />
      </Table.Cell>
    </Table.Row>
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
