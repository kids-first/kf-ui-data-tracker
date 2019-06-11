import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import FileElement from './FileElement';
import ReactPaginate from 'react-paginate';
import NotificationBar from '../NotificationBar/NotificationBar';
import {fileSortedVersions} from '../../common/fileUtils';
/**
 * Displays list of study files
 */
const FileList = ({className, fileList, studyId}) => {
  let fileListClass = classes('FileList', className);
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
      <ul className={fileListClass}>
        {fileList.length ? (
          offset.map(({node}) => (
            <FileElement key={node.kfId} fileListId={studyId} fileNode={node} />
          ))
        ) : (
          <h3 className="FileList--Empty">You don't have any files yet.</h3>
        )}
      </ul>
      {pageCount() > 0 && (
        <Fragment>
          <p className="m-0 text-sm text-mediumGrey text-right">
            {offset.length} of {fileList.length} files
          </p>
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount()}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            forcePage={page}
            onPageChange={handlePageClick}
            containerClassName={'Pagination'}
            subContainerClassName={'Pagination'}
            activeClassName={'Pagination--active'}
          />
        </Fragment>
      )}
    </Fragment>
  );
};

FileList.propTypes = {
  /** Any additional classes to be applied to the study list*/
  className: PropTypes.string,
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
