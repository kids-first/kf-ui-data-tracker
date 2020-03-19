import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
  Dropdown,
  Input,
  Segment,
  Responsive,
  Divider,
  Popup,
} from 'semantic-ui-react';
import {
  createDateSort,
  modifiedDateSort,
  defaultSort,
  downloadFile,
} from '../../utilities';
import {fileTypeDetail, defaultTagOptions} from '../../../common/enums';
/**
 * Filter Bar for Study Files, returns filtered list in "filteredList" render prop
 */
const ListFilterBar = ({
  fileList,
  filteredList,
  studyId,
  selection,
  setSelection,
  downloadFileMutation,
  deleteFile,
}) => {
  const [sortMethod, setSortMethod] = useState('');
  const [sortDirection, setSortDirection] = useState('ascending');
  const [typeFilterStatus, setTypeFilterStatus] = useState('');
  const [tagFilterStatus, setTagFilterStatus] = useState('');
  const [searchString, setSearchString] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);

  var defaultTags = {};
  defaultTagOptions.map(tagObj => (defaultTags[tagObj.key] = tagObj.text));
  var tagList = [];
  fileList.map(({node}) => {
    node.tags.map(tag => {
      if (!tagList.includes(tag)) {
        tagList.push(tag);
      }
      return true;
    });
    return true;
  });
  const tagOptions = tagList
    .sort()
    .map(t => ({key: t, value: t, text: defaultTags[t] ? defaultTags[t] : t}));

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
      obj.node.tags.join(',').includes(tagFilterStatus),
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
      {selection.length > 0 ? (
        <Segment className="noHorizontalPadding" basic compact floated="right">
          <Button
            className="h-38"
            compact
            basic
            primary
            size="large"
            icon="download"
            labelPosition="left"
            content="Download Selected Document"
            onClick={e => {
              e.stopPropagation();
              selection.map(fileId =>
                downloadFile(studyId, fileId, null, downloadFileMutation),
              );
            }}
          />
          {deleteFile && (
            <Popup
              trigger={
                <Button
                  className="h-38"
                  compact
                  basic
                  negative
                  size="large"
                  icon="trash alternate"
                  labelPosition="left"
                  content="Delete Selected Document"
                  onClick={e => {
                    e.stopPropagation();
                  }}
                />
              }
              header="Are you sure?"
              content={
                <>
                  These files and all of their versions and history will be
                  deleted
                  <Divider />
                  <Button
                    data-testid="delete-confirm"
                    negative
                    fluid
                    icon={<Icon name="trash alternate" />}
                    content="Delete"
                    onClick={e => {
                      e.stopPropagation();
                      selection.map(fileId =>
                        deleteFile({variables: {kfId: fileId}}),
                      );
                      setSelection([]);
                    }}
                  />
                </>
              }
              on="click"
              position="top right"
            />
          )}
        </Segment>
      ) : (
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
              primary={typeFilterStatus !== '' || tagFilterStatus !== ''}
              icon="filter"
              onClick={() => setShowFilter(!showFilter)}
            />
            <Input
              aria-label="file-search-input"
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
                  disabled={tagOptions.length === 0}
                  selectOnBlur={false}
                  value={tagFilterStatus}
                  options={tagOptions}
                  placeholder="Tag"
                  onChange={(e, {value}) => {
                    setTagFilterStatus(value);
                  }}
                />
                <Dropdown
                  fluid
                  selection
                  clearable
                  selectOnBlur={false}
                  value={typeFilterStatus}
                  options={typeOptions}
                  placeholder="Document type"
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
              aria-label="file-search-input"
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
                  placeholder="Tags"
                  icon="tag"
                  selection
                  clearable
                  disabled={tagOptions.length === 0}
                  selectOnBlur={false}
                  value={tagFilterStatus}
                  options={tagOptions}
                  onChange={(e, {value}) => {
                    setTagFilterStatus(value);
                  }}
                />
                <Dropdown
                  button
                  selection
                  clearable
                  selectOnBlur={false}
                  value={typeFilterStatus}
                  options={typeOptions}
                  placeholder="Document type"
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
                disabled={tagOptions.length === 0}
                selectOnBlur={false}
                value={tagFilterStatus}
                options={tagOptions}
                placeholder="Tag"
                onChange={(e, {value}) => {
                  setTagFilterStatus(value);
                }}
              />
              <Dropdown
                selection
                clearable
                selectOnBlur={false}
                value={typeFilterStatus}
                options={typeOptions}
                placeholder="Document type"
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
              aria-label="file-search-input"
              icon="search"
              onChange={(e, {value}) => {
                setSearchString(value);
              }}
              value={searchString}
            />
          </Responsive>
        </>
      )}
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
