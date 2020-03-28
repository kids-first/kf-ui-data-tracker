import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import FileElement from './FileElement';
import {fileLatestStatus} from '../../utilities';
import {
  Header,
  Icon,
  Segment,
  Message,
  Pagination,
  Table,
  Checkbox,
} from 'semantic-ui-react';

/**
 * Displays list of study files
 */
const FileList = ({
  fileList,
  studyId,
  isAdmin,
  updateFile,
  updateError,
  downloadFileMutation,
  deleteFile,
  selection,
  setSelection,
}) => {
  const perPage = 10;
  const [page, setPage] = useState(1);
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
  let pageCount = Math.ceil(fileList.length / perPage);
  let paginatedList = fileList.slice(
    perPage * (page - 1),
    perPage * (page - 1) + perPage,
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
        <>
          <Table stackable selectable compact="very" celled>
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
                <Table.HeaderCell textAlign="center" width="1">
                  Type
                </Table.HeaderCell>
                <Table.HeaderCell className="px-20">
                  Document Details
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Tags</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {paginatedList.map(({node}) => (
                <FileElement
                  key={node.kfId}
                  fileListId={studyId}
                  fileNode={node}
                  isAdmin={isAdmin}
                  updateFile={updateFile}
                  selection={selection}
                  onSelectOne={onSelectOne}
                  deleteFile={isAdmin ? deleteFile : null}
                  downloadFileMutation={downloadFileMutation}
                />
              ))}
            </Table.Body>
          </Table>
        </>
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
