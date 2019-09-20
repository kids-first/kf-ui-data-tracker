import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import Badge from '../Badge/Badge';
import {Header, Table, Icon, List, Responsive} from 'semantic-ui-react';

import FileActionsContainer from '../../containers/FileActionsContainer';
import {
  fileSortedVersions,
  fileLatestDate,
  fileLatestSize,
  lengthLimit,
} from '../../common/fileUtils';
import {fileTypeDetail} from '../../common/enums';
import {longDate} from '../../common/dateUtils';

const useRecentlyUpdated = (latestDate, fileId) => {
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    let FIVE_MIN = 300000;
    let docs = sessionStorage.getItem('kf_updated_docs');
    // make sure we only select one row
    if (fileId === docs) {
      // make sure that row was updated less than 5 minutes ago
      if (new Date().getTime() - Date.parse(latestDate) < FIVE_MIN) {
        setJustUpdated(true);
        setTimeout(() => {
          // reset after 7seconds
          setJustUpdated(false);
          sessionStorage.removeItem('kf_updated_docs');
        }, 7000);
      }
    }
    return () => {
      setJustUpdated(false);
    };
  }, [latestDate, fileId]);

  return justUpdated;
};

/**
 * Displays a list of file attributes
 */
const FileAttributes = ({
  latestDate,
  fileSize,
  fileType,
  horizontal,
  fileVersions,
  fileKfID,
}) => {
  const justUpdated = useRecentlyUpdated(latestDate, fileKfID);

  return (
    <List horizontal={horizontal} link={!justUpdated}>
      <List.Item>
        <List.Content verticalAlign="middle">
          <Icon
            name={`${fileType.icon || 'question'}`}
            size="small"
            color="grey"
          />
          {fileType.title}
        </List.Content>
      </List.Item>

      <List.Item>
        <List.Content>
          {justUpdated ? <Icon name="refresh" /> : null}
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
        <List.Content>{fileVersions} versions </List.Content>
      </List.Item>
      <List.Item>
        <List.Content>{fileSize}</List.Content>
      </List.Item>
    </List>
  );
};

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

  const justUpdated = useRecentlyUpdated(latestDate, fileKfID);
  return (
    <Table.Row
      style={{backgroundColor: justUpdated ? '#f8ffff' : 'inherit'}}
      data-testid="file-item"
      className="cursor-pointer"
      onClick={() =>
        history.push(`/study/${match.params.kfId}/documents/${fileKfID}`)
      }
    >
      <Table.Cell textAlign="center">
        <Header>
          {justUpdated && (
            <>
              <Badge state="UPD" icon="refresh" className="mb-5" />
              <br />
            </>
          )}

          <Badge
            state={versionState}
            loading={loading}
            filled={versionState === 'CHN'}
          />
        </Header>
      </Table.Cell>
      <Table.Cell>
        <Header size="medium" as="span">
          <Link to={`/study/${match.params.kfId}/documents/${fileKfID}`}>
            {fileName}
          </Link>
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
          fileVersions={fileNode.versions.edges.length}
          horizontal={true}
        />
        <Responsive
          as={FileAttributes}
          maxWidth={Responsive.onlyTablet.minWidth}
          fileKfID={fileKfID}
          latestDate={latestDate}
          fileSize={fileSize}
          fileType={fileType}
          fileVersions={fileNode.versions.edges.length}
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
