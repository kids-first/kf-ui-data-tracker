import React from 'react';
import FileDetail from '../components/FileDetail/FileDetail';
import {Dimmer, Loader, Message} from 'semantic-ui-react';
import {Query, Mutation} from 'react-apollo';
import {UPDATE_FILE} from '../state/mutations';
import {GET_FILE_BY_ID} from '../state/queries';
import PropTypes from 'prop-types';

const FileDetailContainer = ({kfId, history, match}) => {
  return (
    <Query query={GET_FILE_BY_ID} variables={{kfId}}>
      {({loading, error, data}) => {
        if (loading)
          return (
            <Dimmer active inverted>
              <Loader size="large">Loading File Details ...</Loader>
            </Dimmer>
          );
        if (error)
          return (
            <Message
              negative
              icon="warning circle"
              header="Error"
              content={error.message}
            />
          );
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
