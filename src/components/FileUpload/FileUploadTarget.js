import React from 'react';
import classes from 'classnames';
import PropTypes from 'prop-types';

const FileUploadTarget = props => {
  const {
    className,
    error,
    instructions,
    handleSelectedFile,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = props;

  const fileUploadFormClass = classes(
    'upload-target',
    'w-full',
    'p-32',
    'bg-lightGrey',
    'border-grey',
    'border-2',
    'border-dashed',
    'text-center',
    className,
  );

  return (
    <form
      className={fileUploadFormClass}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {instructions ? (
        <p className="max-w-full pt-0 pb-4 mt-0">
          {instructions}
          <br />
          <small className="m-0 p-0">
            <i>or</i>
          </small>
        </p>
      ) : null}
      <input
        type="file"
        className="Button Button--default"
        onChange={handleSelectedFile}
      />
      {error && error.graphQLErrors && (
        <h4 className="text-red px-2">
          Failed to upload: {error.graphQLErrors.map(err => err.message)}
        </h4>
      )}
    </form>
  );
};

FileUploadTarget.propTypes = {
  /** any additional classes that should be added to the container */
  className: PropTypes.string,
  /** if cursor is currently dragging over the component */
  dragging: PropTypes.bool,
  /** Errors from graphQL */
  errors: PropTypes.object,
  /** add helpful instruction about how to drag and drop files */
  instructions: PropTypes.string,
  /** operation when component is dragged over */
  handleDragOver: PropTypes.func.isRequired,
  /** operation when the cursor enters the componen in drag state */
  onDragEnter: PropTypes.func.isRequired,
  /** operation when cursor leaves component in drag state */
  onDragLeave: PropTypes.func.isRequired,
  /** operation when a drag is released on the component */
  handleDrop: PropTypes.func.isRequired,
  /** operations for selected files */
  handleSelectedFile: PropTypes.func.isRequired,
};

FileUploadTarget.defaultProps = {
  className: null,
  instructions: 'Drag and drop Files here',
  dragging: false,
};

/**
 * @component
 */
export default FileUploadTarget;
