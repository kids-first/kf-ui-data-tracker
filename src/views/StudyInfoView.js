import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import {UPDATE_STUDY} from '../state/mutations';
import {
  Container,
  Segment,
  Message,
  Placeholder,
  Header,
} from 'semantic-ui-react';
import EmptyView from './EmptyView';

const StudyInfoView = ({
  study: {loading, studyByKfId, error},
  user,
  updateStudy,
}) => {
  const isBeta = !user.loading ? user.myProfile.roles.includes('BETA') : false;

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
  if (error)
    return (
      <Container as={Segment} basic>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );
  if (isBeta) {
    return (
      <Container as={Segment} basic vertical>
        <Header as="h2" className="mt-6" floated="left">
          Study basic info
        </Header>
        />
      </Container>
    );
  } else {
    return <EmptyView />;
  }
};

export default compose(
  graphql(GET_STUDY_BY_ID, {
    name: 'study',
    options: props => ({
      variables: {
        kfId: props.match.params.kfId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(UPDATE_STUDY, {
    name: 'updateStudy',
  }),
  graphql(MY_PROFILE, {name: 'user'}),
)(StudyInfoView);
