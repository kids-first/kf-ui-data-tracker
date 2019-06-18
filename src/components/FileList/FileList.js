import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import FileElement from './FileElement';
import NotificationBar from '../NotificationBar/NotificationBar';
import {fileSortedVersions} from '../../common/fileUtils';
import Pagination from '../Pagination/Pagination';
import {Header, Icon, List, Segment} from 'semantic-ui-react';
/**
 * Displays list of study files
 */
const FileList = ({className, fileList, studyId}) => {
  const perPage = 5;
  const [page, setPage] = useState(0);
  const handlePageClick = data => {
    setPage(data.selected);
  };
  const pageCount = () => {
    if (Math.ceil(fileList.length / perPage) < page + 1) {
      setPage(page - 1);
    }
    return Math.ceil(fileList.length / perPage);
  };
  const offset = fileList.slice(perPage * page, perPage * page + perPage);

  const showNotification = () => {
    var statusList = [];
    var i;
    for (i in fileList) {
      const sortedVersions = fileSortedVersions(fileList[i].node);
      const versionStatus =
        sortedVersions.length > 0 ? sortedVersions[0].node.state : null;
      statusList.push(versionStatus);
    }
    if (statusList.includes('CHN')) {
      return (
        <NotificationBar
          borderColor="rgba(221,31,42,1)"
          backgroundColor="rgba(221,31,42,0.1)"
          icon="error"
          message="Changes Needed"
          note="The DRC has requested that you make changes to some of your documents."
        />
      );
    } else {
      return null;
    }
  };

  return (
    <Fragment>
      {showNotification()}
      <List divided selection>
        {fileList.length ? (
          offset.map(({node}) => (
            <FileElement key={node.kfId} fileListId={studyId} fileNode={node} />
          ))
        ) : (
          <Segment basic>
            <Header icon textAlign="center">
              <Icon name="file alternate outline" />
              You don't have any documents yet.
            </Header>
          </Segment>
        )}
      </List>
      {pageCount() > 1 && (
        <Pagination
          rowCount={fileList.length}
          currentPageNum={offset.length}
          pageCount={pageCount()}
          page={page}
          onPageClick={handlePageClick}
        />
      )}
    </Fragment>
  );
};

FileList.propTypes = {
  /** Array of study object*/
  fileList: PropTypes.array,
  /** Kids First unique study identifier (SD_XXXXXXXX) */
  studyId: PropTypes.string.isRequired,
};

FileList.defaultProps = {
  className: null,
  fileList: [],
  studyId: null,
};

export default FileList;
