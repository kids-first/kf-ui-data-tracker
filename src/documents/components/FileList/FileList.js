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

import {withAnalyticsTracking} from '../../../analyticsTracking';

/**
 * Displays list of study files
 */
const FileList = ({
  fileList,
  studyId,
  isAdmin,
  tracking: {logEvent, EVENT_CONSTANTS},
}) => {
  const perPage = 10;
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const handlePageClick = (e, {activePage}) => {
    e.persist();
    logEvent(EVENT_CONSTANTS.LIST.PAGINATE, {
      button_text: isNaN(e.target.innerHTML)
        ? e.target.innerHTML.match(/chevron (left|right)/g)[0]
        : e.target.innerHTML,
      active_page: activePage,
      button_type: 'pagination item',
      page_count: pageCount,
      per_page: perPage,
    });
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
                <Table stackable selectable compact="very" celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">
                        Approval
                      </Table.HeaderCell>
                      <Table.HeaderCell className="px-20">
                        Document Details
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Actions
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {paginatedList.map(({node}) => (
                      <FileElement
                        key={node.kfId}
                        fileListId={studyId}
                        fileNode={node}
                        isAdmin={isAdmin}
                        eventProperties={{scope: 'StudyFilesListView'}}
                      />
                    ))}
                  </Table.Body>
                </Table>
              );
            }}
            eventProperties={{study: {kfId: studyId}}}
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

export default withAnalyticsTracking(FileList);
