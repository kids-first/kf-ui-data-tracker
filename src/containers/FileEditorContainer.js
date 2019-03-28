import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import FileEditor from '../components/FileAnnotation/FileEditor';
import {LoadingPlaceholder} from '../components/Loading';
import {Query, Mutation} from 'react-apollo';
import {UPDATE_FILE} from '../state/mutations';
import {GET_FILE_BY_ID} from '../state/queries';
import PropTypes from 'prop-types';

const FileEditorContainer = ({kfId, history, match}) => {
  const [fileType, setFileType] = useState();

  // Updates the file then routes to the study's files listing
  const onSubmit = (e, updateFile) => {
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
    updateFile({variables: {kfId, name, description, fileType}})
      .then(() => {
        history.push(`/study/${match.params.kfId}/files`);
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
                  {...data.fileByKfId}
                  fileType={fileType}
                  selectFileType={selectFileType}
                  onSubmit={e => onSubmit(e, updateFile)}
                />
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
