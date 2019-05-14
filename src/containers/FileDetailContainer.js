import React from 'react';
import FileDetail from '../components/FileDetail/FileDetail';
import {LoadingPlaceholder} from '../components/Loading';
import {Query, Mutation} from 'react-apollo';
import {UPDATE_FILE} from '../state/mutations';
import {GET_FILE_BY_ID} from '../state/queries';
import PropTypes from 'prop-types';

const FileDetailContainer = ({kfId, history, match}) => {
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
            {(updateFile, {_}) => {
              return <FileDetail fileNode={data.fileByKfId} />;
            }}
          </Mutation>
        );
      }}
    </Query>
  );
};

FileDetail.propTypes = {
  /** File object*/
  fileNode: PropTypes.object.isRequired,
};

export default FileDetailContainer;
