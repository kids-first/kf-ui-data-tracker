import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import FileElement from './FileElement';
/**
 * Displays unordered studies in grid view (include empty stage message)
 */
const FileList = ({className, fileList}) => {
  let fileListClass = classes('FileList', className);

  return (
    <ul className={fileListClass}>
      {fileList.length ? (
        fileList.map(({node}) => (
          <FileElement key={node.kfId} fileNode={node} />
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
};

FileList.defaultProps = {
  className: null,
  fileList: [],
};

export default FileList;
