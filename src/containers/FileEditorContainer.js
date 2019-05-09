import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import FileEditor from '../components/FileAnnotation/FileEditor';
import {LoadingPlaceholder} from '../components/Loading';
import {Query, Mutation} from 'react-apollo';
import {UPDATE_FILE, UPDATE_FILE_STATUS, DELETE_FILE} from '../state/mutations';
import {GET_FILE_BY_ID, GET_STUDY_BY_ID} from '../state/queries';
import PropTypes from 'prop-types';

const FileEditorContainer = ({kfId, history, match}) => {
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

  return (
    <Query query={GET_FILE_BY_ID} variables={{kfId}}>
      {({loading, error, data}) => {
        if (loading) return <LoadingPlaceholder componentName="File Editor" />;
        if (error) return `Error!: ${error}`;
        // Set the current file type to whatever the query returns, if it's
        // not yet been selected by the user

        if (data.fileByKfId.status != 'staged' && fileType == undefined) {
          setFileType(data.fileByKfId.fileType);
        }
        if (fileNameInput === undefined) setFileName(data.fileByKfId.name);
        return (
          <Mutation mutation={UPDATE_FILE_STATUS}>
            {(updateFileStatus, {__}) => {
              return (
                <Mutation
                  mutation={UPDATE_FILE}
                  refetchQueries={res => [
                    {
                      query: GET_FILE_BY_ID,
                      variables: {kfId},
                    },
                  ]}
                >
                  {(updateFile, {_}) => {
                    return (
                      <Mutation
                        mutation={DELETE_FILE}
                        update={(cache, {data: {deleteFile}}) => {
                          // Re-writes the study in the cache with the deleted file
                          // removed.
                          const {studyByKfId} = cache.readQuery({
                            query: GET_STUDY_BY_ID,
                            variables: {kfId: match.params.kfId},
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
                        }}
                      >
                        {(deleteFile, {x}) => {
                          return (
                            <FileEditor
                              kfId={data.fileByKfId.kfId}
                              name={fileNameInput}
                              description={data.fileByKfId.description}
                              fileType={fileType}
                              selectFileType={selectFileType}
                              onCancel={e =>
                                cancelEdit(deleteFile, data.fileByKfId)
                              }
                              onSubmit={e =>
                                onSubmit(
                                  e,
                                  updateFile,
                                  updateFileStatus,
                                  data.fileByKfId.id,
                                )
                              }
                              onNameChange={e => setFileName(e.target.value)}
                            />
                          );
                        }}
                      </Mutation>
                    );
                  }}
                </Mutation>
              );
            }}
          </Mutation>
        );
      }}
    </Query>
  );
};

FileEditor.propTypes = {
  kfId: PropTypes.string.isRequired,
};

export default withRouter(FileEditorContainer);
