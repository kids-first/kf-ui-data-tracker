import {
  Checkbox,
  Header,
  Icon,
  Message,
  Pagination,
  Segment,
  Table,
} from 'semantic-ui-react';
import React, {Fragment, useState} from 'react';
import {fileLatestDate, fileSortedVersions} from '../../utilities';

import {DOCS_PER_PAGE} from '../../../common/globals';
import FileSimpleElement from './FileSimpleElement';
import PropTypes from 'prop-types';

const dateSort = (a, b) => new Date(a) - new Date(b);
const stringSort = (a, b) =>
  a !== null && b !== null ? a.localeCompare(b) : 0;

const columnSorts = {
  type: (f1, f2) => stringSort(f1.fileType, f2.fileType),
  updatedAt: (f1, f2) =>
    dateSort(
      fileLatestDate(fileSortedVersions(f1)),
      fileLatestDate(fileSortedVersions(f2)),
    ),
  title: (f1, f2) => stringSort(f1.title, f2.title),
  kfId: (f1, f2) => stringSort(f1.kfId, f2.kfId),
};

/**
 * Displays list of study files and folder in one directory
 */
const FileSimpleList = ({
  fileList,
  studyId,
  updateFile,
  updateError,
  downloadFileMutation,
  deleteFile,
  selection,
  setSelection,
  tagOptions,
  setOpenedNode,
  setInputOpen,
  setRenameOpen,
  setDeleteOpen,
  updateHash,
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
    if (
      selection.length === fileList.filter(node => !node.isDirectory).length
    ) {
      setSelection([]);
    } else {
      setSelection(
        fileList.filter(node => !node.isDirectory).map(node => node.kfId),
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
  const foldersFirst = ordered
    .filter(obj => obj.isDirectory)
    .concat(ordered.filter(obj => !obj.isDirectory));

  let pageCount = Math.ceil(foldersFirst.length / DOCS_PER_PAGE);
  let paginatedList = foldersFirst.slice(
    DOCS_PER_PAGE * (page - 1),
    DOCS_PER_PAGE * (page - 1) + DOCS_PER_PAGE,
  );

  return (
    <Fragment>
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
                  disabled={
                    fileList.filter(node => !node.isDirectory).length === 0
                  }
                  data-testid="file-select-all"
                  checked={
                    selection.length ===
                      fileList.filter(node => !node.isDirectory).length &&
                    fileList.filter(node => !node.isDirectory).length > 0
                  }
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
                sorted={sorting.column === 'title' ? sorting.direction : null}
                onClick={handleSort('title')}
                className="px-20"
              >
                Name
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
            {paginatedList.map((node, index) => (
              <FileSimpleElement
                key={index}
                fileListId={studyId}
                fileNode={node}
                updateFile={updateFile}
                selected={selection.includes(node.kfId)}
                onSelectOne={onSelectOne}
                deleteFile={deleteFile}
                downloadFileMutation={downloadFileMutation}
                tagOptions={tagOptions}
                setOpenedNode={setOpenedNode}
                setInputOpen={setInputOpen}
                setRenameOpen={setRenameOpen}
                setDeleteOpen={setDeleteOpen}
                updateHash={updateHash}
              />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Segment basic className="mt-30">
          <Header disabled icon textAlign="center">
            <Icon name="folder open outline" />
            No documents in this folder
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

FileSimpleList.propTypes = {
  /** Array of study object*/
  fileList: PropTypes.array,
  /** Kids First unique study identifier (SD_XXXXXXXX) */
  studyId: PropTypes.string.isRequired,
};

FileSimpleList.defaultProps = {
  fileList: [],
  studyId: null,
};

export default FileSimpleList;
