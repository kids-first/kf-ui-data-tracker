import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import Badge from '../Badge/Badge';
import {Header, Table, Icon, List, Responsive} from 'semantic-ui-react';

import FileActionsContainer from '../../containers/FileActionsContainer';
import {
  fileTypeDetail,
  fileSortedVersions,
  fileLatestDate,
  fileLatestSize,
  lengthLimit,
} from '../../common/fileUtils';
import {longDate} from '../../common/dateUtils';

/**
 * Displays a list of file attributes
 */
const FileAttributes = ({latestDate, fileSize, fileType, horizontal}) => (
  <List horizontal={horizontal} link>
    <List.Item>
      <List.Content verticalAlign="middle">
        {' '}
        <Icon
          name={`${fileType.icon || 'question'}`}
          size="small"
          color="grey"
        />{' '}
        {fileType.title}
      </List.Content>
    </List.Item>
    <List.Item>
      <List.Content>
        {latestDate ? (
          <>
            Modified{' '}
            <TimeAgo
              date={latestDate}
              live={false}
              title={longDate(latestDate)}
            />
          </>
        ) : (
          'Unknown time'
        )}
      </List.Content>
    </List.Item>
    <List.Item>
      <List.Content>{fileSize}</List.Content>
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
  fileType: PropTypes.object.isRequired,
  /** Whether the list should be displayed horizontally */
  horizontal: PropTypes.bool,
};

FileAttributes.defaultProps = {
  horizontal: false,
};

/**
 * Displays unordered study files in list view
 */
const FileElement = ({fileNode, loading, history, match, fileListId}) => {
  const fileKfID = fileNode.kfId || 'unknown ID';
  const fileName = fileNode.name || 'unknown file name';
  const fileDescription = fileNode.description || null;
  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const fileSize = fileLatestSize(sortedVersions);
  const fileType =
    fileNode && fileTypeDetail[fileNode.fileType]
      ? fileTypeDetail[fileNode.fileType]
      : {title: 'unknown', icon: 'question'};
  const versionState =
    sortedVersions.length > 0 ? sortedVersions[0].node.state : null;
  return (
    <Table.Row
      data-testid="file-item"
      className="cursor-pointer"
      onClick={() =>
        history.push(`/study/${match.params.kfId}/documents/${fileKfID}`)
      }
    >
      <Table.Cell singleLine collapsing textAlign="center">
        <Badge
          state={versionState}
          loading={loading}
          filled={versionState === 'CHN'}
        />
      </Table.Cell>
      <Table.Cell>
        <Header size="medium" as="span">
          {fileName}
        </Header>
        <p className="noMargin">
          {fileDescription ? <>{lengthLimit(fileDescription, 100)}</> : null}
        </p>
        <Responsive
          as={FileAttributes}
          minWidth={Responsive.onlyTablet.minWidth}
          fileKfID={fileKfID}
          latestDate={latestDate}
          fileSize={fileSize}
          fileType={fileType}
          horizontal={true}
        />
        <Responsive
          as={FileAttributes}
          maxWidth={Responsive.onlyTablet.minWidth}
          fileKfID={fileKfID}
          latestDate={latestDate}
          fileSize={fileSize}
          fileType={fileType}
          horizontal={false}
        />
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Responsive
          as={FileActionsContainer}
          minWidth={Responsive.onlyTablet.minWidth}
          node={fileNode}
          studyId={fileListId}
          vertical={true}
          fluid={false}
        />
        <Responsive
          as={FileActionsContainer}
          maxWidth={Responsive.onlyTablet.minWidth}
          node={fileNode}
          studyId={fileListId}
          vertical={false}
          fluid={true}
        />
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
