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
import {createDateSort, modifiedDateSort, defaultSort} from '../../utilities';
import {fileTypeDetail, defaultTagOptions} from '../../../common/enums';
/**
 * Filter Bar for Study Files, returns filtered list in "filteredList" render prop
 */
const ListFilterBar = ({fileList, filters, setFilters, hidden}) => {
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
    var sortedList = fileList.sort(
      sortFuncs[filters.sortMethod] || sortFuncs.default,
    );
    sortedList =
      filters.sortDirection === 'ascending' ? sortedList : sortedList.reverse();
    sortedList = sortedList.filter(obj =>
      obj.node.fileType.includes(filters.typeFilterStatus),
    );
    sortedList = sortedList.filter(obj =>
      obj.node.tags.join(',').includes(filters.tagFilterStatus),
    );
    sortedList = sortedList.filter(
      obj =>
        obj.node.name
          .toLowerCase()
          .includes(filters.searchString.toLowerCase()) ||
        obj.node.description
          .toLowerCase()
          .includes(filters.searchString.toLowerCase()),
    );
    return sortedList;
  };

  return (
    <>
      <div className={hidden ? 'hidden' : ''}>
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
            primary={filters.sortMethod !== ''}
            icon="sort"
            onClick={() => setShowSort(!showSort)}
          />
          <Button
            data-testid="show-filter-button"
            basic={!showFilter}
            floated="right"
            primary={
              filters.typeFilterStatus !== '' || filters.tagFilterStatus !== ''
            }
            icon="filter"
            onClick={() => setShowFilter(!showFilter)}
          />
          <Input
            aria-label="file-search-input"
            className="mr-80"
            fluid
            icon="search"
            onChange={(e, {value}) =>
              setFilters({...filters, searchString: value})
            }
            value={filters.searchString}
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
                value={filters.tagFilterStatus}
                options={tagOptions}
                placeholder="Tag"
                onChange={(e, {value}) =>
                  setFilters({...filters, tagFilterStatus: value})
                }
              />
              <Dropdown
                fluid
                selection
                clearable
                selectOnBlur={false}
                value={filters.typeFilterStatus}
                options={typeOptions}
                placeholder="Document type"
                onChange={(e, {value}) =>
                  setFilters({...filters, typeFilterStatus: value})
                }
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
                  if (filters.sortDirection === 'ascending') {
                    setFilters({...filters, sortMethod: 'descending'});
                  } else {
                    setFilters({...filters, sortMethod: 'ascending'});
                  }
                }}
              >
                <Icon name={'sort content ' + filters.sortDirection} />
              </Button>
              <div className="mr-40">
                <Dropdown
                  fluid
                  selection
                  clearable
                  selectOnBlur={false}
                  value={filters.sortMethod}
                  options={sortOptions}
                  placeholder="Date option"
                  onChange={(e, {value}) =>
                    setFilters({...filters, sortMethod: value})
                  }
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
            onChange={(e, {value}) =>
              setFilters({...filters, searchString: value})
            }
            value={filters.searchString}
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
                value={filters.tagFilterStatus}
                options={tagOptions}
                onChange={(e, {value}) =>
                  setFilters({...filters, tagFilterStatus: value})
                }
              />
              <Dropdown
                button
                selection
                clearable
                selectOnBlur={false}
                value={filters.typeFilterStatus}
                options={typeOptions}
                placeholder="Document type"
                onChange={(e, {value}) =>
                  setFilters({...filters, typeFilterStatus: value})
                }
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
                value={filters.sortMethod}
                options={sortOptions}
                onChange={(e, {value}) =>
                  setFilters({...filters, sortMethod: value})
                }
              />
              <Button
                icon
                basic
                data-testid="sort-direction-button"
                onClick={() => {
                  if (filters.sortDirection === 'ascending') {
                    setFilters({...filters, sortDirection: 'descending'});
                  } else {
                    setFilters({...filters, sortDirection: 'ascending'});
                  }
                }}
              >
                <Icon name={'sort content ' + filters.sortDirection} />
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
              value={filters.tagFilterStatus}
              options={tagOptions}
              placeholder="Tag"
              onChange={(e, {value}) =>
                setFilters({...filters, tagFilterStatus: value})
              }
            />
            <Dropdown
              selection
              clearable
              selectOnBlur={false}
              value={filters.typeFilterStatus}
              options={typeOptions}
              placeholder="Document type"
              onChange={(e, {value}) =>
                setFilters({...filters, typeFilterStatus: value})
              }
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
              value={filters.sortMethod}
              options={sortOptions}
              placeholder="Date option"
              onChange={(e, {value}) =>
                setFilters({...filters, sortMethod: value})
              }
            />
            <Button
              icon
              basic
              data-testid="sort-direction-button"
              onClick={() => {
                if (filters.sortDirection === 'ascending') {
                  setFilters({...filters, sortMethod: 'descending'});
                } else {
                  setFilters({...filters, sortMethod: 'ascending'});
                }
              }}
            >
              <Icon name={'sort content ' + filters.sortDirection} />
            </Button>
          </Segment>
          <Input
            fluid
            aria-label="file-search-input"
            icon="search"
            onChange={(e, {value}) =>
              setFilters({...filters, searchString: value})
            }
            value={filters.searchString}
          />
        </Responsive>
      </div>
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
