import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import FileEditor from '../components/FileAnnotation/FileEditor';
import {LoadingPlaceholder} from '../components/Loading';
import {UPDATE_FILE, UPDATE_FILE_STATUS, DELETE_FILE} from '../state/mutations';
import {GET_FILE_BY_ID, GET_STUDY_BY_ID} from '../state/queries';
import PropTypes from 'prop-types';

const FileEditorContainer = ({
  kfId,
  history,
  match,
  data: {error, loading, fileByKfId},
  updateFileStatus,
  updateFile,
  deleteFile,
}) => {
  const [fileType, setFileType] = useState();
  const [fileNameInput, setFileName] = useState();

  // remove the file if it's only staged
  const cancelEdit = (deleteFile, {status, kdIf}) => {
    if (status === 'staged') deleteFile({variables: {kfId}});
    history.goBack();
  };

  // Updates the file then routes to the study's files listing
  const onSubmit = async (e, updateFile, updateFileStatus, id) => {
    e.preventDefault();
    const name = fileNameInput;
    const description = e.target.description.value;
    try {
      await updateFile({
        variables: {name, description, kfId, fileType},
      });
      await updateFileStatus({variables: {id, status: 'New'}});
      history.push(`/study/${match.params.kfId}/files`);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Called from the onChange event on the file type radio buttons
   */
  const selectFileType = e => {
    setFileType(e.target.value);
  };

  if (loading) return <LoadingPlaceholder componentName="File Editor" />;
  if (error) return `Error!: ${error}`;
  // Set the current file type to whatever the query returns, if it's
  // not yet been selected by the user

  if (fileByKfId.status !== 'staged' && fileType === undefined) {
    setFileType(fileByKfId.fileType);
  }
  if (fileNameInput === undefined) setFileName(fileByKfId.name);

  return (
    <FileEditor
      kfId={fileByKfId.kfId}
      name={fileNameInput}
      description={fileByKfId.description}
      fileType={fileType}
      selectFileType={selectFileType}
      onCancel={e => cancelEdit(deleteFile, fileByKfId)}
      onSubmit={e => onSubmit(e, updateFile, updateFileStatus, fileByKfId.id)}
      onNameChange={e => setFileName(e.target.value)}
    />
  );
};

FileEditorContainer.propTypes = {
  /** Kids First Unique Study File ID (SF_XXXXXXXX) */
  kfId: PropTypes.string.isRequired,
  /** history object from react-router-dom */
  history: PropTypes.any,
  /** route matching object from react-router-dom */
  match: PropTypes.any,
  data: PropTypes.shape({
    /** Apollo Client graphQL error */
    error: PropTypes.string,
    /** Apollo Client graphQL loading state */
    loading: PropTypes.bool,
    /** graphQl FileNode respose */
    fileByKfId: PropTypes.object,
  }),
  /** grpahQL mutation to update file node status in cache: accepts FileNodeId:String, status: String */
  updateFileStatus: PropTypes.func,
  /** grpahQL mutation to update file node on server: accepts FileNode name, description, kfId, fileType */
  updateFile: PropTypes.func,
  /** grpahQL mutation to delete file node on server: accepts FileNode kfId */
  deleteFile: PropTypes.func,
};

export default compose(
  withRouter,
  graphql(GET_FILE_BY_ID, {
    variables: props => ({kfid: props.kfId}),
  }),
  graphql(UPDATE_FILE_STATUS, {
    name: 'updateFileStatus',
  }),
  graphql(UPDATE_FILE, {
    options: props => ({
      refetchQueries: [
        {
          query: GET_FILE_BY_ID,
          variables: {kfId: props.kfId},
        },
      ],
    }),
    name: 'updateFile',
  }),
  graphql(DELETE_FILE, {
    options: props => ({
      update: (cache, {data: {deleteFile}}) => {
        // Re-writes the study in the cache with the deleted file
        // removed.
        const {studyByKfId} = cache.readQuery({
          query: GET_STUDY_BY_ID,
          variables: {kfId: props.match.params.kfId},
        });
        const deleteIndex = studyByKfId.files.edges.findIndex(
          edge => edge.node.kfId === deleteFile.kfId,
        );
        if (deleteIndex < 0) {
          return studyByKfId;
        }
        studyByKfId.files.edges.splice(deleteIndex, 1);
        const data = {
          studyByKfId: {
            ...studyByKfId,
            files: {
              __typename: 'FileNodeConnection',
              edges: studyByKfId.files.edges,
            },
          },
        };
        cache.writeQuery({
          query: GET_STUDY_BY_ID,
          data,
        });
      },
    }),
    name: 'deleteFile',
  }),
)(FileEditorContainer);
