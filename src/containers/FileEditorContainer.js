import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {LoadingPlaceholder} from '../components/Loading';
import {Query, Mutation} from 'react-apollo';
import {UPDATE_FILE} from '../state/mutations';
import {GET_FILE_BY_ID} from '../state/queries';
import PropTypes from 'prop-types';

const FileEditorContainer = ({kfId, history, match, children}) => {
  const [fileType, setFileType] = useState();
  const [fileNameInput, setFileName] = useState();
  const [fileDescriptionInput, setFileDescription] = useState();
  // Updates the file then routes to the study's files listing
  const onSubmit = (e, updateFile, onSubmitCallBack) => {
    e.preventDefault();
    const name = fileNameInput;
    const description = fileDescriptionInput;
    updateFile({variables: {kfId, name, description, fileType}})
      .then(() => {
        if (onSubmitCallBack) {
          onSubmitCallBack();
        } else {
          history.goBack();
        }
      })
      .catch(err => console.log(err));
  };

  /**
   * Called from the onChange event on the file type radio buttons
   */
  const selectFileType = e => {
    setFileType(e.target.value);
  };

  return (
    <Query query={GET_FILE_BY_ID} variables={{kfId}}>
      {({loading, error, data}) => {
        if (loading) return <LoadingPlaceholder componentName="File Editor" />;
        if (error) return `Error!: ${error}`;
        // Set the current file type to whatever the query returns, if it's
        // not yet been selected by the user
        if (fileType === undefined) setFileType(data.fileByKfId.fileType);
        if (fileNameInput === undefined) setFileName(data.fileByKfId.name);
        return (
          <Mutation
            mutation={UPDATE_FILE}
            update={(cache, {data: {updateFile}}) => {
              // Re-writes the study in the cache with the deleted file
              // removed.
              const {fileByKfId} = cache.readQuery({
                query: GET_FILE_BY_ID,
                variables: {kfId},
              });
              const data = {
                fileByKfId: {
                  ...fileByKfId,
                  ...updateFile.file,
                },
              };
              cache.writeQuery({
                query: GET_FILE_BY_ID,
                data,
              });
            }}
          >
            {(updateFile, {_}) =>
              children &&
              children({
                updateFile,
                fileByKfId: data.fileByKfId,
                fileNameInput,
                fileType,
                selectFileType,
                onSubmit,
                setFileName,
                setFileDescription,
              })
            }
          </Mutation>
        );
      }}
    </Query>
  );
};

FileEditorContainer.propTypes = {
  kfId: PropTypes.string.isRequired,
};

export default withRouter(FileEditorContainer);
