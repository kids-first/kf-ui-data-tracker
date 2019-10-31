import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import FileElement from './FileElement';
import ListFilterBar from '../ListFilterBar/ListFilterBar';
import {fileLatestStatus} from '../../utilities';
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
const FileList = ({fileList, studyId, isAdmin}) => {
  const perPage = 10;
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const handlePageClick = (e, {activePage}) => {
    setPage(activePage);
  };

  return (
    <Fragment>
      {fileList.filter(obj => fileLatestStatus(obj.node) === 'CHN').length >
        0 && (
        <Message
          negative
          icon="warning circle"
          header="Changes Needed"
          content="The DRC has requested that you make changes to some of your documents."
        />
      )}
      {fileList.length ? (
        <>
          <ListFilterBar
            fileList={fileList}
            filteredList={filteredList => {
              setPageCount(Math.ceil(filteredList.length / perPage));

              let paginatedList = filteredList.slice(
                perPage * (page - 1),
                perPage * (page - 1) + perPage,
              );

              return (
                <Table stackable selectable compact="very" basic="very">
                  <Table.Body>
                    {paginatedList.map(({node}) => (
                      <FileElement
                        key={node.kfId}
                        fileListId={studyId}
                        fileNode={node}
                        isAdmin={isAdmin}
                        eventProperties={inherit => ({
                          scope: [...inherit.scope, 'FileElement'],
                        })}
                      />
                    ))}
                  </Table.Body>
                </Table>
              );
            }}
          />
        </>
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
