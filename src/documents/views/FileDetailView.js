import React from 'react';
import {graphql, compose} from 'react-apollo';
import {MY_PROFILE} from '../../state/queries';
import {GET_FILE_BY_ID} from '../queries';
import {UPDATE_FILE} from '../mutations';
import {Container, Segment, Dimmer, Loader, Message} from 'semantic-ui-react';
import FileDetail from '../components/FileDetail/FileDetail';

const FileDetailView = ({
  file: {loading, error, fileByKfId},
  match,
  user,
  updateFile,
}) => {
  const isAdmin = !user.loading
    ? user.myProfile.roles.includes('ADMIN')
    : false;

  if (loading)
    return (
      <Dimmer active inverted>
        <Loader size="large">Loading File Details ...</Loader>
      </Dimmer>
    );

  if (error)
    return (
      <Container as={Segment} basic vertical>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );

  return (
    <Container as={Segment} basic vertical>
      <FileDetail fileNode={fileByKfId} isAdmin={isAdmin} />
    </Container>
  );
};

export default compose(
  graphql(GET_FILE_BY_ID, {
    name: 'file',
    options: props => ({variables: {kfId: props.match.params.fileId}}),
  }),
  graphql(UPDATE_FILE, {
    name: 'updateFile',
    options: props => ({
      awaitRefetchQueries: true,
      refetchQueries: [
        {query: GET_FILE_BY_ID, variables: {kfId: props.match.params.fileId}},
      ],
    }),
  }),
  graphql(MY_PROFILE, {name: 'user'}),
)(FileDetailView);
