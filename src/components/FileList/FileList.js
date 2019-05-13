import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import FileElement from './FileElement';

/**
 * Displays list of study files
 */
const FileList = ({className, fileList, studyId}) => {
  let fileListClass = classes('FileList', className);

  return (
    <ul className={fileListClass}>
      {fileList.length ? (
        fileList.map(({node}) => (
          <FileElement key={node.kfId} fileListId={studyId} fileNode={node} />
        ))
      ) : (
        <h3 className="FileList--Empty">You don't have any files yet.</h3>
      )}
    </ul>
  );
};

FileList.propTypes = {
  /** Any additional classes to be applied to the study list*/
  className: PropTypes.string,
  /** Array of study object*/
  fileList: PropTypes.array,
  /** Kids First unique study identifier (SD_XXXXXXXX) */
  studyId: PropTypes.string.isRequired,
};

FileList.defaultProps = {
  className: null,
  fileList: [],
  studyId: null,
};

export default FileList;
