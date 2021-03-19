import {
  Checkbox,
  Header,
  Icon,
  Pagination,
  Segment,
  Table,
} from 'semantic-ui-react';
import React, {Fragment, useState} from 'react';
import {fileLatestDate, fileSortedVersions} from '../../utilities';

import {DOCS_PER_PAGE} from '../../../common/globals';
import PropTypes from 'prop-types';
import ReviewFileElement from './ReviewFileElement';

const dateSort = (a, b) => new Date(a) - new Date(b);
const stringSort = (a, b) =>
  a !== null && b !== null ? a.localeCompare(b) : 0;

const columnSorts = {
  type: (f1, f2) => stringSort(f1.node.fileType, f2.node.fileType),
  updatedAt: (f1, f2) =>
    dateSort(
      fileLatestDate(fileSortedVersions(f1.node)),
      fileLatestDate(fileSortedVersions(f2.node)),
    ),
  name: (f1, f2) => stringSort(f1.node.name, f2.node.name),
  kfId: (f1, f2) => stringSort(f1.node.kfId, f2.node.kfId),
};

/**
 * Displays list of study files for data review
 */
const ReviewFileList = ({
  fileList,
  studyId,
  downloadFileMutation,
  selection,
  setSelection,
  tagOptions,
}) => {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState({
    column: 'updatedAt',
    direction: 'descending',
  });

  const handleSort = column => () => {
    const direction =
      sorting.column !== column
        ? 'ascending'
        : sorting.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    setSorting({
      column,
      direction,
    });
  };

  const handlePageClick = (e, {activePage}) => {
    setPage(activePage);
  };
  const onSelectOne = fileID => {
    if (selection.includes(fileID)) {
      setSelection(selection.filter(id => id !== fileID));
    } else {
      setSelection([...selection, fileID]);
    }
  };
  const onSelectAll = () => {
    if (selection.length === fileList.length) {
      setSelection([]);
    } else {
      setSelection(
        fileList.map(({node}) => fileSortedVersions(node)[0].node.id),
      );
    }
  };

  const sorted = fileList
    .concat()
    .sort(
      (f1, f2) =>
        columnSorts.hasOwnProperty(sorting.column) &&
        columnSorts[sorting.column](f1, f2),
    );
  const ordered = sorting.direction === 'ascending' ? sorted : sorted.reverse();

  let pageCount = Math.ceil(ordered.length / DOCS_PER_PAGE);
  let paginatedList = ordered.slice(
    DOCS_PER_PAGE * (page - 1),
    DOCS_PER_PAGE * (page - 1) + DOCS_PER_PAGE,
  );

  return (
    <Fragment>
      {fileList.length ? (
        <Table singleLine stackable selectable sortable compact="very" celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                textAlign="center"
                width="1"
                onClick={e => {
                  e.stopPropagation();
                  onSelectAll();
                }}
              >
                <Checkbox
                  data-testid="file-select-all"
                  checked={selection.length === fileList.length}
                />
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={sorting.column === 'type' ? sorting.direction : null}
                textAlign="center"
                width="1"
                onClick={handleSort('type')}
              >
                Type
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={sorting.column === 'name' ? sorting.direction : null}
                onClick={handleSort('name')}
                className="px-20"
              >
                Document Details
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  sorting.column === 'updatedAt' ? sorting.direction : null
                }
                textAlign="center"
                width="1"
                onClick={handleSort('updatedAt')}
              >
                Last Updated
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={sorting.column === 'kfId' ? sorting.direction : null}
                textAlign="center"
                width="1"
                onClick={handleSort('kfId')}
              >
                Kids First ID
              </Table.HeaderCell>

              <Table.HeaderCell textAlign="center">Tags</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedList.map(({node}) => (
              <ReviewFileElement
                key={node.kfId}
                fileListId={studyId}
                fileNode={node}
                selected={selection.includes(
                  fileSortedVersions(node)[0].node.id,
                )}
                onSelectOne={onSelectOne}
                downloadFileMutation={downloadFileMutation}
                tagOptions={tagOptions}
              />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Segment basic>
          <Header disabled icon textAlign="center">
            <Icon name="file alternate outline" />
            No documents matching your filter or search term
          </Header>
        </Segment>
      )}
      {pageCount > 1 && (
        <Segment basic textAlign="right">
          Showing {DOCS_PER_PAGE} of {fileList.length} files{' '}
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

ReviewFileList.propTypes = {
  /** Array of study object*/
  fileList: PropTypes.array,
  /** Kids First unique study identifier (SD_XXXXXXXX) */
  studyId: PropTypes.string.isRequired,
};

ReviewFileList.defaultProps = {
  fileList: [],
  studyId: null,
};

export default ReviewFileList;
