import React from 'react';
import PropTypes from 'prop-types';
import {Button, Header, Icon, Segment} from 'semantic-ui-react';

const FileUploadTarget = props => {
  const {
    error,
    instructions,
    handleSelectedFile,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = props;

  return (
    <form
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Segment piled placeholder>
        {instructions ? (
          <Header icon>
            <Icon name="file outline" />
            {instructions}
            <br />
            <small>or</small>
          </Header>
        ) : null}
        <br />
        <Button icon primary labelPosition="left" as="label" htmlFor="file">
          <Icon name="file outline" />
          Choose a file
        </Button>
        <input
          hidden
          multiple
          id="file"
          type="file"
          onChange={handleSelectedFile}
        />
        {error && error.graphQLErrors && (
          <Header as="h4">
            Failed to upload: {error.graphQLErrors.map(err => err.message)}
          </Header>
        )}
      </Segment>
    </form>
  );
};

FileUploadTarget.propTypes = {
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
  instructions: 'Drag and drop Files here',
  dragging: false,
};

/**
 * @component
 */
export default FileUploadTarget;
