import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import FileElement from './FileElement';
import {
  fileLatestStatus,
  fileSortedVersions,
  fileLatestDate,
} from '../../utilities';
import {DOCS_PER_PAGE} from '../../../common/globals';
import {
  Header,
  Icon,
  Segment,
  Message,
  Pagination,
  Table,
  Checkbox,
} from 'semantic-ui-react';

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
};

/**
 * Displays list of study files
 */
const FileList = ({
  fileList,
  studyId,
  updateFile,
  updateError,
  downloadFileMutation,
  deleteFile,
  selection,
  setSelection,
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
  const onSelectOne = fileKfID => {
    if (selection.includes(fileKfID)) {
      setSelection(selection.filter(id => id !== fileKfID));
    } else {
      setSelection([...selection, fileKfID]);
    }
  };
  const onSelectAll = () => {
    if (selection.length === fileList.length) {
      setSelection([]);
    } else {
      setSelection(fileList.map(({node}) => node.kfId));
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
      {fileList.filter(obj => fileLatestStatus(obj.node) === 'CHN').length >
        0 && (
        <Message
          negative
          icon="warning circle"
          header="Changes Needed"
          content="The DRC has requested that you make changes to some of your documents."
        />
      )}
      {updateError && (
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={updateError.message}
        />
      )}
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
              <Table.HeaderCell textAlign="center">Tags</Table.HeaderCell>
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
              <Table.HeaderCell textAlign="center" width="2">
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
                updateFile={updateFile}
                selected={selection.includes(node.kfId)}
                onSelectOne={onSelectOne}
                deleteFile={deleteFile}
                downloadFileMutation={downloadFileMutation}
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
