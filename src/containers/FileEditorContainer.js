import React from 'react';
import {withRouter} from 'react-router-dom';
import FileEditor from '../components/FileAnnotation/FileEditor';
import {LoadingPlaceholder} from '../components/Loading';
import {Query, Mutation} from 'react-apollo';
import {UPDATE_FILE} from '../state/mutations';
import {GET_FILE_BY_ID} from '../state/queries';
import PropTypes from 'prop-types';

const FileEditorContainer = ({kfId, history, match}) => {
  // Updates the file then routes to the study's files listing
  const onSubmit = (e, updateFile) => {
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
    updateFile({variables: {kfId, name, description}})
      .then(() => {
        history.push(`/study/${match.params.kfId}/files`);
      })
      .catch(err => console.log(err));
  };

  return (
    <Query query={GET_FILE_BY_ID} variables={{kfId}}>
      {({loading, error, data}) => {
        if (loading) return <LoadingPlaceholder componentName="File Editor" />;
        if (error) return `Error!: ${error}`;
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
            {(updateFile, {_}) => (
              <FileEditor
                {...data.fileByKfId}
                onSubmit={e => onSubmit(e, updateFile)}
              />
            )}
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
