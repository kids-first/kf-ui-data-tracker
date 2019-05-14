import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {GET_STUDY_BY_ID} from '../state/queries';
import {Mutation} from 'react-apollo';
import FileUploadTarget from '../components/FileUpload/FileUploadTarget';
import {CREATE_FILE} from '../state/mutations';

const UploadContainer = props => {
  const [dragging, setDragging] = useState(false);
  const [count, setCount] = useState(0);

  const handleDragOver = e => {
    e.preventDefault();
  };

  const handleDragEnter = e => {
    e.preventDefault();
    setCount(count + 1);

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const handleDragLeave = e => {
    e.preventDefault();
    setCount(count - 1);

    if (count === 0) {
      setDragging(false);
    }
  };

  // General handler for uploading files
  // Will forward user to annotation page when a file has been uploaded
  const uploadAndAnnotate = (createFile, file) => {
    const studyId = props.match.params.kfId;
    createFile({
      variables: {file, studyId},
    })
      .then(resp => {
        if (resp.data.createFile.success) {
          props.history.push(
            `files/${resp.data.createFile.file.kfId}/annotation/`,
          );
        }
      })
      .catch(err => {
        console.log(err);
        alert('Failed to upload file.');
      });
  };

  // Upload a file when a document is selected from the browser window
  const handleSelectedFile = (e, createFile) => {
    e.preventDefault();
    uploadAndAnnotate(createFile, e.target.files[0]);
  };

  // Upload a file when it is dropped on the container
  const handleDrop = (e, createFile) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadAndAnnotate(createFile, e.dataTransfer.files[0]);
    }
  };

  return (
    <Mutation
      mutation={CREATE_FILE}
      refetchQueries={res => [
        {
          query: GET_STUDY_BY_ID,
          variables: {kfId: props.match.params.kfId},
        },
      ]}
    >
      {(createFile, {data, error}) => (
        <FileUploadTarget
          error={error}
          dragging={dragging}
          handleDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          handleDrop={e => handleDrop(e, createFile)}
          handleSelectedFile={e => handleSelectedFile(e, createFile)}
          instructions="To upload files, drag and drop them here"
        />
      )}
    </Mutation>
  );
};

export default withRouter(UploadContainer);
