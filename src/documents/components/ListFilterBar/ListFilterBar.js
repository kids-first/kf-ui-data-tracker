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
import {fileTypeDetail, defaultTagOptions} from '../../../common/enums';
/**
 * Filter Bar for Study Files, returns filtered list in "filteredList" render prop
 */
const ListFilterBar = ({fileList, filters, setFilters}) => {
  const [showFilter, setShowFilter] = useState(false);

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

  return (
    <>
      <Responsive
        as={Segment}
        maxWidth={699}
        basic
        className="noHorizontalPadding"
      >
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
