import React from 'react';
import PropTypes from 'prop-types';
import {Amplitude} from '@amplitude/react-amplitude';
import {
  Icon,
  Form,
  Responsive,
  Segment,
  Popup,
  Checkbox,
  Button,
} from 'semantic-ui-react';
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
  showId,
  setShowId,
  hideBatchAction,
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
          {!hideBatchAction && (
            <BatchActions
              fileList={fileList}
              studyId={studyId}
              deleteFile={deleteFile}
              downloadFileMutation={downloadFileMutation}
              selection={selection}
              setSelection={setSelection}
              disabled={disabled}
            />
          )}
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
              className="pr-0"
              multiple
              button
              placeholder="Tags"
              selection
              clearable
              disabled={tagOptions.length === 0}
              selectOnBlur={false}
              value={filters.tagFilterStatus}
              options={[
                ...tagOptions,
                {
                  key: 'untagged',
                  value: 'untagged',
                  text: '-- Untagged --',
                  content: <i className="text-gray">-- Untagged --</i>,
                },
              ]}
              onChange={(e, {value}) =>
                setFilters({...filters, tagFilterStatus: value})
              }
            />
            <Popup
              inverted
              position="top center"
              content="Tags intersect or union"
              trigger={
                <Button
                  className="h-38 px-10 mr-14"
                  compact
                  basic
                  size="large"
                  content={filters.andJoin ? 'AND' : 'OR'}
                  data-testid="tag-filter-and-or"
                  onClick={e => {
                    e.stopPropagation();
                    setFilters({...filters, andJoin: !filters.andJoin});
                  }}
                />
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
          {setShowId && (
            <Amplitude
              eventProperties={inheritedProps => ({
                ...inheritedProps,
                scope: inheritedProps.scope
                  ? [
                      ...inheritedProps.scope,
                      'toggle button',
                      'show file kf_id',
                    ]
                  : ['toggle button', 'show file kf_id'],
              })}
            >
              {({logEvent}) => (
                <Checkbox
                  floated="right"
                  className="font-normal"
                  label="Show Kids First ID"
                  checked={showId}
                  onClick={() => {
                    setShowId(!showId);
                    logEvent('toggle file kfId ' + (showId ? 'off' : 'on'));
                    localStorage.setItem('showFileId', !showId);
                  }}
                  data-cy="toggle file kfId"
                />
              )}
            </Amplitude>
          )}
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
              className="pr-0"
              multiple
              selection
              clearable
              label="Filter by:"
              disabled={tagOptions.length === 0}
              selectOnBlur={false}
              value={filters.tagFilterStatus}
              options={[
                ...tagOptions,
                {
                  key: 'untagged',
                  value: 'untagged',
                  text: '-- Untagged --',
                  content: <i className="text-gray">-- Untagged --</i>,
                },
              ]}
              placeholder="Tag"
              onChange={(e, {value}) =>
                setFilters({...filters, tagFilterStatus: value})
              }
            />
            <Popup
              inverted
              position="top center"
              content="Tags intersect or union"
              trigger={
                <Button
                  className="h-38 px-10 mr-14"
                  compact
                  basic
                  size="large"
                  content={filters.andJoin ? 'AND' : 'OR'}
                  data-testid="tag-filter-and-or"
                  onClick={e => {
                    e.stopPropagation();
                    setFilters({...filters, andJoin: !filters.andJoin});
                  }}
                />
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
            {setShowId && (
              <Amplitude
                eventProperties={inheritedProps => ({
                  ...inheritedProps,
                  scope: inheritedProps.scope
                    ? [
                        ...inheritedProps.scope,
                        'toggle button',
                        'show file kf_id',
                      ]
                    : ['toggle button', 'show file kf_id'],
                })}
              >
                {({logEvent}) => (
                  <Checkbox
                    floated="right"
                    className="font-normal"
                    label="Show Kids First ID"
                    checked={showId}
                    onClick={() => {
                      setShowId(!showId);
                      logEvent('toggle file kfId ' + (showId ? 'off' : 'on'));
                      localStorage.setItem('showFileId', !showId);
                    }}
                    data-cy="toggle file kfId"
                  />
                )}
              </Amplitude>
            )}
          </Form.Group>
          {!hideBatchAction && (
            <BatchActions
              fileList={fileList}
              studyId={studyId}
              deleteFile={deleteFile}
              downloadFileMutation={downloadFileMutation}
              selection={selection}
              setSelection={setSelection}
              disabled={disabled}
            />
          )}
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
