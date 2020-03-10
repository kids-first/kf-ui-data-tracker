import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {MY_PROFILE, GET_STUDY_BY_ID} from '../state/queries';
import {
  Container,
  Segment,
  Message,
  Placeholder,
  Header,
  Button,
  Icon,
} from 'semantic-ui-react';
import EmptyView from './EmptyView';
import NotFoundView from './NotFoundView';

const CollaboratorsView = ({match, history}) => {
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      kfId: match.params.kfId,
    },
    fetchPolicy: 'network-only',
  });
  const studyByKfId = data && data.studyByKfId;
  const user = useQuery(MY_PROFILE);

  const isAdmin =
    !user.loading && user.data.myProfile
      ? user.data.myProfile.roles.includes('ADMIN')
      : false;
  if (loading)
    return (
      <Container as={Segment} basic vertical>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Container>
    );
  if (error || user.error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study collaborators - Error ${
              studyByKfId ? 'for ' + studyByKfId.kfId : null
            }`}
          </title>
        </Helmet>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {error && error.message && <p>Study Error: {error.message}</p>}
            {user.error && user.error.message && (
              <p>User Error: {user.error.message}</p>
            )}
          </Message.Content>
        </Message>
      </Container>
    );
  if (studyByKfId === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the study with ID ${match.params.kfId}`}
      />
    );
  }
  if (isAdmin) {
    return (
      <Container as={Segment} basic vertical>
        <Helmet>
          <title>{`KF Data Tracker - Study collaborators - Error ${
            studyByKfId ? 'for ' + studyByKfId.name : null
          }`}</title>
        </Helmet>
        <Button
          basic
          primary
          floated="right"
          size="mini"
          icon="add"
          content="ADD COLLABORATOR"
        />
        <Header as="h2" className="noMargin">
          Collaborators
        </Header>
      </Container>
    );
  } else {
    return (
      <>
        <Helmet>
          <title>KF Data Tracker - Collaborators for {studyByKfId.name}</title>
        </Helmet>
        <EmptyView />
      </>
    );
  }
};

export default CollaboratorsView;
