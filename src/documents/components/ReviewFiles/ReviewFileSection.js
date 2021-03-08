import React, {useState} from 'react';

import ListFilterBar from '../ListFilterBar/ListFilterBar';
import ReviewFileList from './ReviewFileList';
import {Segment} from 'semantic-ui-react';

const filterFiles = (fileList, filters) => {
  // Filter by fileType
  var filteredList = fileList.filter(obj =>
    obj.node.fileType.includes(filters.typeFilterStatus),
  );
  // Filter by tags
  if (filters.tagFilterStatus.length > 0) {
    filteredList = filteredList.filter(obj =>
      filters.tagFilterStatus.includes('untagged')
        ? filters.andJoin
          ? filters.tagFilterStatus
              .filter(t => t !== 'untagged')
              .every(t => obj.node.tags.includes(t)) ||
            obj.node.tags.length === 0
          : obj.node.tags.some(
              t =>
                filters.tagFilterStatus
                  .filter(t => t !== 'untagged')
                  .indexOf(t) >= 0,
            ) || obj.node.tags.length === 0
        : filters.andJoin
        ? filters.tagFilterStatus.every(t => obj.node.tags.includes(t))
        : obj.node.tags.some(t => filters.tagFilterStatus.indexOf(t) >= 0),
    );
  }

  // Filter by search string
  filteredList = filteredList.filter(
    obj =>
      obj.node.kfId
        .toLowerCase()
        .includes(filters.searchString.toLowerCase()) ||
      obj.node.name
        .toLowerCase()
        .includes(filters.searchString.toLowerCase()) ||
      obj.node.description
        .toLowerCase()
        .includes(filters.searchString.toLowerCase()),
  );
  return filteredList;
};

/**
 * Display study documents with filter bar and batch selection for data review
 */
const ReviewFileSection = ({
  studyId,
  files,
  selectedFiles,
  setSelectedFiles,
}) => {
  const [filters, setFilters] = useState({
    typeFilterStatus: '',
    tagFilterStatus: [],
    searchString: '',
    andJoin: true,
  });

  // Computed state
  const filteredFiles = filterFiles(files, filters);

  // Form tag options accoring the current used tags in this study
  var tagList = [];
  files.map(({node}) => {
    node.tags.map(tag => {
      if (!tagList.includes(tag)) {
        tagList.push(tag);
      }
      return true;
    });
    return true;
  });
  const tagOptions = tagList.sort().map(t => ({key: t, value: t, text: t}));

  return (
    <>
      <Segment
        className="pt-10 pr-0 pb-10 noMargin small-inline"
        clearing
        basic
        textAlign="right"
        floated="right"
      >
        {selectedFiles.length + '/' + files.length + ' selected '}
      </Segment>
      <ListFilterBar
        fileList={files}
        filters={filters}
        setFilters={setFilters}
        studyId={studyId}
        selection={selectedFiles}
        setSelection={setSelectedFiles}
        disabled={selectedFiles.length === 0}
        tagOptions={tagOptions}
        hideBatchAction={true}
      />
      <ReviewFileList
        fileList={filteredFiles}
        studyId={studyId}
        selection={selectedFiles}
        setSelection={setSelectedFiles}
        tagOptions={tagOptions}
      />
    </>
  );
};

export default ReviewFileSection;
