import {Checkbox, Header, Icon, Popup, Table} from 'semantic-ui-react';
import {Link, withRouter} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {fileLatestDate, fileSortedVersions} from '../../utilities';

import FileActionButtons from '../FileActionButtons/FileActionButtons';
import FileTags from '../FileDetail/FileTags';
import KfId from '../../../components/StudyList/KfId';
import Markdown from 'react-markdown';
import PropTypes from 'prop-types';
import TimeAgo from 'react-timeago';
import {fileTypeDetail} from '../../../common/enums';
import {longDate} from '../../../common/dateUtils';

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
 * Displays unordered study files in list view
 */
const FileElement = ({
  fileNode,
  loading,
  history,
  match,
  fileListId,
  updateFile,
  deleteFile,
  downloadFileMutation,
  selected,
  onSelectOne,
  tagOptions,
  showId,
  filters,
  setFilters,
}) => {
  const fileKfID = fileNode.kfId || 'unknown ID';
  const fileName = fileNode.name || 'unknown file name';
  // Show at most 5 lines of the description
  const fileDescription =
    fileNode.description
      .split('\n')
      .splice(0, 5)
      .join('\n') || '';
  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const fileType =
    fileNode && fileTypeDetail[fileNode.fileType]
      ? fileTypeDetail[fileNode.fileType]
      : fileTypeDetail.OTH;
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
      <Table.Cell
        textAlign="center"
        onClick={e => {
          e.stopPropagation();
          onSelectOne(fileKfID);
        }}
      >
        <Checkbox data-testid="file-select" checked={selected} />
      </Table.Cell>
      <Popup
        wide="very"
        mouseEnterDelay={500}
        header={fileType.title || 'Unknown Type'}
        content={fileType.description || 'Unknown Type'}
        trigger={
          <Table.Cell textAlign="center">
            <Icon name={fileType.icon || 'question'} />
          </Table.Cell>
        }
      />
      <Popup
        wide="very"
        position="top left"
        trigger={
          <Table.Cell>
            {fileDescription.length > 3 && <Icon name="info circle" />}
            <Link to={`/study/${match.params.kfId}/documents/${fileKfID}`}>
              {fileName.substring(0, 65)}
              {fileName.length > 65 && '...'}
            </Link>
          </Table.Cell>
        }
        mouseLeaveDelay={500}
        content={
          <>
            {fileName.length > 65 && <Header as="h6">{fileName}</Header>}
            <Markdown
              source={fileDescription}
              renderers={{
                image: Image,
                table: props => <Table>{props.children}</Table>,
              }}
              linkTarget="_blank"
            />
          </>
        }
      />
      {showId && <KfId kfId={fileNode.kfId} />}
      <Table.Cell textAlign="center" width="4">
        <FileTags
          fileNode={fileNode}
          updateFile={updateFile}
          defaultOptions={tagOptions}
          limit={2}
          filters={filters}
          setFilters={setFilters}
        />
      </Table.Cell>
      <Table.Cell textAlign="center" width="1">
        <TimeAgo date={latestDate} live={false} title={longDate(latestDate)} />
      </Table.Cell>
      <Table.Cell textAlign="center">
        <FileActionButtons
          fluid
          node={fileNode}
          studyId={fileListId}
          deleteFile={deleteFile}
          downloadFileMutation={downloadFileMutation}
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
