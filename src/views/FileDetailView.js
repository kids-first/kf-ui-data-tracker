import React from 'react';
import {graphql} from 'react-apollo';
import FileDetailContainer from '../containers/FileDetailContainer';
import {MY_PROFILE} from '../state/queries';
import {Container, Segment} from 'semantic-ui-react';

const FileDetailView = ({match, user}) => {
  const fileId = match.params.fileId;
  const isAdmin = !user.loading
    ? user.myProfile.roles.includes('ADMIN')
    : false;
  return (
    <Container as={Segment} basic vertical>
      <FileDetailContainer kfId={fileId} isAdmin={isAdmin} />
    </Container>
  );
};

export default graphql(MY_PROFILE, {name: 'user'})(FileDetailView);
