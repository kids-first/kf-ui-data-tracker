import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types';
import FileElement from './FileElement';
import {
  fileLatestStatus,
  versionState,
  fileTypeDetail,
  createDateSort,
  modifiedDateSort,
  defaultSort,
} from '../../common/fileUtils';
import {
  Header,
  Icon,
  Segment,
  Message,
  Pagination,
  Table,
  Dropdown,
} from 'semantic-ui-react';
import Badge from '../Badge/Badge';

/**
 * Displays list of study files
 */
const FileList = ({fileList, studyId}) => {
  const perPage = 10;
  const [page, setPage] = useState(1);

  const handlePageClick = (e, {activePage}) => {
    setPage(activePage);
  };

  const [sortMethod, setSortMethod] = useState('');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [typeFilterStatus, setTypeFilterStatus] = useState('');
  const [approvalFilterStatus, setApprovalFilterStatus] = useState('');
  const [searchString, setSearchString] = useState('');

  const statusOptions = Object.keys(versionState).map(state => ({
    key: state,
    value: state,
    text: versionState[state].title,
    content: <Badge state={state} />,
  }));
  const typeOptions = Object.keys(fileTypeDetail).map(type => ({
    key: type,
    value: type,
    text: fileTypeDetail[type].title,
    content: (
      <small>
        <Icon name={`${fileTypeDetail[type].icon || 'question'}`} />
        {' ' + fileTypeDetail[type].title}
      </small>
    ),
  }));
  const sortOptions = [
    {
      key: 'createDate',
      value: 'createDate',
      text: 'Create date',
    },
    {
      key: 'modifyDate',
      value: 'modifyDate',
      text: 'Modified date',
    },
  ];

  const sortedFileList = () => {
    const sortFuncs = {
      createdDate: createDateSort,
      modifyDate: modifiedDateSort,
      default: defaultSort,
    };
    var sortedList = fileList.sort(sortFuncs[sortMethod] || sortFuncs.default);
    sortedList =
      sortDirection === 'ascending' ? sortedList : sortedList.reverse();
    sortedList = sortedList.filter(obj =>
      obj.node.fileType.includes(typeFilterStatus),
    );
    sortedList = sortedList.filter(obj =>
      fileLatestStatus(obj.node).includes(approvalFilterStatus),
    );
    sortedList = sortedList.filter(
      obj =>
        obj.node.name.toLowerCase().includes(searchString.toLowerCase()) ||
        obj.node.description.toLowerCase().includes(searchString.toLowerCase()),
    );
    return sortedList;
  };

  const pageCount = Math.ceil(sortedFileList().length / perPage);
  const pageItems = sortedFileList().slice(
    perPage * (page - 1),
    perPage * (page - 1) + perPage,
  );

  return (
    <Fragment>
      <Segment
        className="noMargin noHorizontalPadding"
        basic
        compact
        floated="left"
      >
        <span className="smallLabel">Filter by:</span>
        <Dropdown
          selection
          clearable
          selectOnBlur={false}
          value={approvalFilterStatus}
          options={statusOptions}
          placeholder="Approval status"
          onChange={(e, {value}) => {
            setApprovalFilterStatus(value);
          }}
        />
      </Segment>
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
        <Table stackable selectable compact="very" basic="very">
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
