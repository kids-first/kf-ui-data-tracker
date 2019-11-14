import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
  Dropdown,
  Input,
  Segment,
  Responsive,
} from 'semantic-ui-react';
import Badge from '../../../components/Badge/Badge';
import {
  fileLatestStatus,
  createDateSort,
  modifiedDateSort,
  defaultSort,
} from '../../utilities';
import {versionState, fileTypeDetail} from '../../../common/enums';
/**
 * Filter Bar for Study Files, returns filtered list in "filteredList" render prop
 */
const ListFilterBar = ({fileList, filteredList}) => {
  const [sortMethod, setSortMethod] = useState('');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [typeFilterStatus, setTypeFilterStatus] = useState('');
  const [approvalFilterStatus, setApprovalFilterStatus] = useState('');
  const [searchString, setSearchString] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

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
      <Responsive
        as={Segment}
        maxWidth={699}
        basic
        className="noHorizontalPadding"
      >
        <Button
          data-testid="show-sort-button"
          basic={!showSort}
          floated="right"
          primary={sortMethod !== ''}
          icon="sort"
          onClick={() => setShowSort(!showSort)}
        />
        <Button
          data-testid="show-filter-button"
          basic={!showFilter}
          floated="right"
          primary={typeFilterStatus !== '' || approvalFilterStatus !== ''}
          icon="filter"
          onClick={() => setShowFilter(!showFilter)}
        />
        <Input
          className="mr-80"
          fluid
          icon="search"
          onChange={(e, {value}) => {
            setSearchString(value);
          }}
          value={searchString}
        />
        {showFilter && (
          <Segment>
            <p className="mb-5">
              <Icon name="filter" />
              Filter by:
            </p>
            <Dropdown
              fluid
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
            <Dropdown
              fluid
              selection
              clearable
              selectOnBlur={false}
              value={typeFilterStatus}
              options={typeOptions}
              placeholder="File type"
              onChange={(e, {value}) => {
                setTypeFilterStatus(value);
              }}
            />
          </Segment>
        )}
        {showSort && (
          <Segment>
            <p className="mb-5">
              <Icon name="sort" />
              Sort by:
            </p>
            <Button
              icon
              basic
              floated="right"
              data-testid="sort-direction-button"
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
            <div className="mr-40">
              <Dropdown
                fluid
                selection
                clearable
                selectOnBlur={false}
                value={sortMethod}
                options={sortOptions}
                placeholder="Date option"
                onChange={(e, {value}) => {
                  setSortMethod(value);
                }}
              />
            </div>
          </Segment>
        )}
      </Responsive>
      <Responsive
        as={Segment}
        minWidth={700}
        maxWidth={999}
        basic
        className="noHorizontalPadding"
      >
        <Input
          fluid
          icon="search"
          onChange={(e, {value}) => {
            setSearchString(value);
          }}
          value={searchString}
        />
        <Segment clearing basic className="noHorizontalPadding noMargin">
          <Segment
            className="noMargin noVerticalPadding noHorizontalPadding"
            basic
            compact
            floated="left"
          >
            <Dropdown
              labeled
              button
              className="icon noMargin"
              placeholder="Approval status"
              icon="filter"
              selection
              clearable
              selectOnBlur={false}
              value={approvalFilterStatus}
              options={statusOptions}
              onChange={(e, {value}) => {
                setApprovalFilterStatus(value);
              }}
            />
            <Dropdown
              button
              selection
              clearable
              selectOnBlur={false}
              value={typeFilterStatus}
              options={typeOptions}
              placeholder="File type"
              onChange={(e, {value}) => {
                setTypeFilterStatus(value);
              }}
            />
          </Segment>
          <Segment
            className="noMargin noVerticalPadding noHorizontalPadding"
            basic
            compact
            floated="right"
          >
            <Dropdown
              labeled
              button
              className="icon noMargin"
              placeholder="Date option"
              icon="sort"
              selection
              clearable
              selectOnBlur={false}
              value={sortMethod}
              options={sortOptions}
              onChange={(e, {value}) => {
                setSortMethod(value);
              }}
            />
            <Button
              icon
              basic
              data-testid="sort-direction-button"
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
          </Segment>
        </Segment>
      </Responsive>
      <Responsive
        as={Segment}
        minWidth={1000}
        clearing
        basic
        className="noHorizontalPadding"
      >
        <Segment
          className="noMargin noVerticalPadding noHorizontalPadding"
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
          <Dropdown
            selection
            clearable
            selectOnBlur={false}
            value={typeFilterStatus}
            options={typeOptions}
            placeholder="File type"
            onChange={(e, {value}) => {
              setTypeFilterStatus(value);
            }}
          />
        </Segment>
        <Segment
          className="noMargin noVerticalPadding noHorizontalPadding"
          basic
          compact
          floated="left"
        >
          <span className="smallLabel">Sort by:</span>
          <Dropdown
            selection
            clearable
            selectOnBlur={false}
            value={sortMethod}
            options={sortOptions}
            placeholder="Date option"
            onChange={(e, {value}) => {
              setSortMethod(value);
            }}
          />
          <Button
            icon
            basic
            data-testid="sort-direction-button"
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
        </Segment>
        <Input
          fluid
          icon="search"
          onChange={(e, {value}) => {
            setSearchString(value);
          }}
          value={searchString}
        />
      </Responsive>
      {filteredList(sortedFileList())}
    </>
  );
};

ListFilterBar.propTypes = {
  /** Array of study files object*/
  fileList: PropTypes.array,
  /** render prop that returns an array of filtered study file objects*/
  filteredList: PropTypes.func,
};

ListFilterBar.defaultProps = {
  fileList: [],
};

export default ListFilterBar;
