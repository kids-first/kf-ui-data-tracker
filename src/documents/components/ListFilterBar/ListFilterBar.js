import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Form, Responsive} from 'semantic-ui-react';
import {fileTypeDetail, defaultTagOptions} from '../../../common/enums';

/**
 * Filter Bar for Study Files, returns filtered list in "filteredList" render prop
 */
const ListFilterBar = ({fileList, filters, setFilters}) => {
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
      <Responsive maxWidth={999}>
        <Form as="div">
          <Form.Input
            fluid
            aria-label="file-search-input"
            icon="search"
            placeholder="Search by name"
            onChange={(e, {value}) =>
              setFilters({...filters, searchString: value})
            }
            value={filters.searchString}
          />
          <Form.Group widths="equal">
            <Form.Dropdown
              button
              placeholder="Tags"
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
            <Form.Dropdown
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
          </Form.Group>
        </Form>
      </Responsive>
      <Responsive minWidth={1000}>
        <Form as="div">
          <Form.Group inline>
            <Form.Dropdown
              selection
              clearable
              label="Filter by:"
              disabled={tagOptions.length === 0}
              selectOnBlur={false}
              value={filters.tagFilterStatus}
              options={tagOptions}
              placeholder="Tag"
              onChange={(e, {value}) =>
                setFilters({...filters, tagFilterStatus: value})
              }
            />
            <Form.Dropdown
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
            <Form.Input
              aria-label="file-search-input"
              icon="search"
              placeholder="Search by name"
              onChange={(e, {value}) =>
                setFilters({...filters, searchString: value})
              }
              value={filters.searchString}
            />
          </Form.Group>
        </Form>
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
