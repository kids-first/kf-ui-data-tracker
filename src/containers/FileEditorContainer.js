import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import FileEditor from '../components/FileAnnotation/FileEditor';
import {LoadingPlaceholder} from '../components/Loading';
import {Query, Mutation} from 'react-apollo';
import {UPDATE_FILE, UPDATE_FILE_STATUS} from '../state/mutations';
import {GET_FILE_BY_ID} from '../state/queries';
import PropTypes from 'prop-types';
import {directive} from '@babel/types';

const FileEditorContainer = ({kfId, history, match}) => {
  const [fileType, setFileType] = useState();
  const [fileNameInput, setFileName] = useState();

  // Updates the file then routes to the study's files listing
  const onSubmit = async (e, updateFile, updateFileStatus, id) => {
    e.preventDefault();
    const name = fileNameInput;
    const description = e.target.description.value;
    try {
      const data = await updateFile({
        variables: {name, description, kfId, fileType},
      });
      const status = await updateFileStatus({variables: {id, status: 'New'}});
      history.push(`/study/${match.params.kfId}/files`);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Called from the onChange event on the file type radio buttons
   */
  const selectFileType = e => {
    debugger;
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
                      <FileEditor
                        kfId={data.fileByKfId.kfId}
                        name={fileNameInput}
                        description={data.fileByKfId.description}
                        fileType={fileType}
                        selectFileType={selectFileType}
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
    </Query>
  );
};

FileEditor.propTypes = {
  kfId: PropTypes.string.isRequired,
};

export default withRouter(FileEditorContainer);
