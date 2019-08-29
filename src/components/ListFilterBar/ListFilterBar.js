import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
  Dropdown,
  Input,
  Menu
} from 'semantic-ui-react';
import Badge from '../Badge/Badge';
import {
  fileLatestStatus,
  versionState,
  fileTypeDetail,
  createDateSort,
  modifiedDateSort,
  defaultSort,
} from '../../common/fileUtils';


/**
 * Filter Bar for Study Files, returns filtered list in "filteredList" render prop
 */
const ListFilterBar = ({ fileList, filteredList }) => {
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


  return (
    <>
      <Menu size='small' >
        <Menu.Item>Filter by:</Menu.Item>
        <Dropdown
          selection
          clearable
          text={approvalFilterStatus ? statusOptions.filter(o => o.key === approvalFilterStatus).text : "Approval Status"}
          selectOnBlur={false}
          value={approvalFilterStatus}
          options={statusOptions}
          placeholder="Approval status"
          onChange={(e, { value }) => {
            setApprovalFilterStatus(value);
          }}
        />
        <Dropdown
          selection
          clearable
          selectOnBlur={false}
          text={typeFilterStatus ? typeOptions.filter(o => o.key === typeFilterStatus).text : "File Category"}
          options={typeOptions}
          placeholder="File type"
          onChange={(e, { value }) => {
            setTypeFilterStatus(value);
          }}
        />
        <Menu.Item></Menu.Item>
        <Menu.Item>Sort by:</Menu.Item>
        <Dropdown
          selection
          clearable
          selectOnBlur={false}
          value={sortMethod}
          options={sortOptions}
          placeholder="Date option"
          onChange={(e, { value }) => {
            setSortMethod(value);
          }}
        />
        <Button
          icon
          basic
          onClick={() => {
            if (sortDirection === 'ascending') {
              setSortDirection('descending');
            } else {
              setSortDirection('ascending');
            }
          }}
        >
          <Icon name={'sort content ' + sortDirection} />
        </Button>
        <Menu.Item position="right" fitted>
          <Input
            type="text"
            icon="search"
            placeholder="Search documents"
            onChange={(e, { value }) => {
              setSearchString(value);
            }}
            value={searchString}
          />
        </Menu.Item>

      </Menu>
      {filteredList(sortedFileList())}
    </>
  )
}

ListFilterBar.propTypes = {
  /** Array of study files object*/
  fileList: PropTypes.array,
  /** render prop that returns an array of filtered study file objects*/
  filteredList: PropTypes.func,
};

export default ListFilterBar;