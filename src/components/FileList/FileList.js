import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import FileElement from './FileElement';
import {fileSortedVersions} from '../../common/fileUtils';
import {
  Header,
  Icon,
  Segment,
  Message,
  Pagination,
  Table,
} from 'semantic-ui-react';
/**
 * Displays list of study files
 */
const FileList = ({fileList, studyId}) => {
  const perPage = 5;
  const [page, setPage] = useState(1);

  const handlePageClick = (e, {activePage}) => {
    setPage(activePage);
  };
  const pageCount = Math.ceil(fileList.length / perPage);
  const pageItems = fileList.slice(
    perPage * (page - 1),
    perPage * (page - 1) + perPage,
  );

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
        <Message
          negative
          icon="warning circle"
          header="Changes Needed"
          content="The DRC has requested that you make changes to some of your documents."
        />
      );
    } else {
      return null;
    }
  };

  return (
    <Fragment>
      {showNotification()}
      {fileList.length ? (
        <Table stackable compact="very" basic="very">
          <Table.Body>
            {pageItems.map(({node}) => (
              <FileElement
                key={node.kfId}
                fileListId={studyId}
                fileNode={node}
              />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Segment basic>
          <Header icon textAlign="center">
            <Icon name="file alternate outline" />
            You don't have any documents yet.
          </Header>
        </Segment>
      )}
      {pageCount > 1 && (
        <Segment basic textAlign="right">
          Showing {perPage} of {fileList.length} files{' '}
          <Pagination
            firstItem={null}
            lastItem={null}
            nextItem={{
              'aria-label': 'Next page',
              content: <Icon name="chevron right" />,
            }}
            prevItem={{
              'aria-label': 'Previous page',
              content: <Icon name="chevron left" />,
            }}
            activePage={page}
            totalPages={pageCount}
            onPageChange={handlePageClick}
          />
        </Segment>
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
  fileList: [],
  studyId: null,
};

export default FileList;
