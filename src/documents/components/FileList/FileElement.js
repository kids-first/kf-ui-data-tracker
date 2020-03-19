import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {withRouter, Link} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import {Header, Table, Icon, Responsive, Checkbox} from 'semantic-ui-react';
import FileActionButtons from '../FileActionButtons/FileActionButtons';
import {fileSortedVersions, fileLatestDate, lengthLimit} from '../../utilities';
import {fileTypeDetail} from '../../../common/enums';
import {longDate} from '../../../common/dateUtils';
import FileTags from '../FileDetail/FileTags';

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
  isAdmin,
  updateFile,
  deleteFile,
  downloadFileMutation,
  selection,
  onSelectOne,
}) => {
  const fileKfID = fileNode.kfId || 'unknown ID';
  const fileName = fileNode.name || 'unknown file name';
  const fileDescription = fileNode.description || null;
  const sortedVersions = fileSortedVersions(fileNode);
  const latestDate = fileLatestDate(sortedVersions);
  const fileType =
    fileNode && fileTypeDetail[fileNode.fileType]
      ? fileTypeDetail[fileNode.fileType]
      : {title: 'unknown', icon: 'question'};
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
        <Checkbox
          data-testid="file-select"
          checked={selection.includes(fileKfID)}
        />
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Icon name={`${fileType.icon || 'question'}`} size="big" />
      </Table.Cell>
      <Table.Cell className="px-20">
        <Header size="medium" as="span">
          <Link to={`/study/${match.params.kfId}/documents/${fileKfID}`}>
            {fileName}
          </Link>
        </Header>
        <small className="text-grey ml-10">
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
        </small>
        <p className="noMargin">
          {fileDescription ? <>{lengthLimit(fileDescription, 100)}</> : null}
        </p>
      </Table.Cell>
      <Table.Cell textAlign="center" width="4">
        <FileTags fileNode={fileNode} updateFile={updateFile} />
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Responsive
          as={FileActionButtons}
          minWidth={Responsive.onlyTablet.minWidth}
          node={fileNode}
          studyId={fileListId}
          vertical={true}
          fluid={false}
          isAdmin={isAdmin}
          deleteFile={deleteFile}
          downloadFileMutation={downloadFileMutation}
        />
        <Responsive
          as={FileActionButtons}
          maxWidth={Responsive.onlyTablet.minWidth - 1}
          node={fileNode}
          studyId={fileListId}
          vertical={false}
          fluid={true}
          isAdmin={isAdmin}
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
