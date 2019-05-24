import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Mutation} from 'react-apollo';
import {CREATE_FILE} from '../state/mutations';

const UploadContainer = ({
  studyId,
  fileId,
  refetchAfterUpload = [],
  history,
  match,
  children,
}) => {
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
  const uploadFile = (file, createFile, onUploadCallBack) => {
    createFile({
      variables: {file, studyId},
    })
      .then(resp => {
        if (resp.data.createFile.success) {
          if (onUploadCallBack) {
            onUploadCallBack();
          } else {
            history.push(`files/${resp.data.createFile.file.kfId}/annotation/`);
          }
        }
      })
      .catch(err => {
        console.log(err);
        alert('Failed to upload file.');
      });
  };

  return (
    <Mutation mutation={CREATE_FILE} refetchQueries={res => refetchAfterUpload}>
      {(createFile, {data, error}) =>
        children &&
        children({
          createFile,
          error,
          dragging,
          handleDragOver,
          handleDragEnter,
          handleDragLeave,
          uploadFile,
        })
      }
    </Mutation>
  );
};

export default withRouter(UploadContainer);
