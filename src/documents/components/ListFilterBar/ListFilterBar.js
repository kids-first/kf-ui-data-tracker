import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Form, Responsive, Segment, Popup} from 'semantic-ui-react';
import {fileTypeDetail} from '../../../common/enums';
import BatchActions from './BatchActions';

/**
 * Filter Bar for Study Files, returns filtered list in "filteredList" render prop
 */
const ListFilterBar = ({
  fileList,
  filters,
  setFilters,
  studyId,
  selection,
  setSelection,
  downloadFileMutation,
  deleteFile,
  disabled,
  tagOptions,
}) => {
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
          <BatchActions
            fileList={fileList}
            studyId={studyId}
            deleteFile={deleteFile}
            downloadFileMutation={downloadFileMutation}
            selection={selection}
            setSelection={setSelection}
            disabled={disabled}
          />
          <Form.Input
            fluid
            aria-label="file-search-input"
            icon="search"
            placeholder="Search by name, description or ID"
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
        <Form as={Segment} clearing basic className="noPadding noMargin">
          <Form.Group
            as={Segment}
            basic
            inline
            className="noPadding"
            floated="left"
          >
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
            <Popup
              inverted
              position="top center"
              content="Search by name, description or ID"
              trigger={
                <Form.Input
                  aria-label="file-search-input"
                  icon="search"
                  placeholder="Search documents"
                  onChange={(e, {value}) =>
                    setFilters({...filters, searchString: value})
                  }
                  value={filters.searchString}
                />
              }
            />
          </Form.Group>
          <BatchActions
            fileList={fileList}
            studyId={studyId}
            deleteFile={deleteFile}
            downloadFileMutation={downloadFileMutation}
            selection={selection}
            setSelection={setSelection}
            disabled={disabled}
          />
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
