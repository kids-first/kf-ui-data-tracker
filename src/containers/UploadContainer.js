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

  // Upload a file when a document is selected from the browser window
  const handleSelectedFile = (e, createFile) => {
    e.preventDefault();
    createFile({
      variables: {file: e.target.files[0], studyId: props.match.params.kfId},
    });
  };

  // Upload a file when it is dropped on the container
  const handleDrop = (e, createFile) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      //handleSelectedFile(e.dataTransfer.files);
      createFile({
        variables: {
          file: e.dataTransfer.files[0],
          studyId: props.match.params.kfId,
        },
      });
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
      {(createFile, {data}) => (
        <FileUploadTarget
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
