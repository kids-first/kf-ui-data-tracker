import React from 'react';
import {graphql, compose} from 'react-apollo';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import StudyHeader from '../components/StudyHeader/StudyHeader';
import {StudyNavBar} from '../components/StudyNavBar';
import {Container, Segment, Message} from 'semantic-ui-react';

const NavBarView = ({study: {loading, studyByKfId, error}, user}) => {
  const isBeta = !user.loading ? user.myProfile.roles.includes('BETA') : false;

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
  return (
    <section id="study">
      <Segment secondary basic>
        <StudyHeader {...studyByKfId} loading={loading} />
      </Segment>
      <Container>
        <StudyNavBar isBeta={isBeta} />
      </Container>
    </section>
  );
};

export default compose(
  graphql(GET_STUDY_BY_ID, {
    name: 'study',
    options: props => ({
      variables: {
        kfId: props.match.params.kfId,
      },
    }),
  }),
  graphql(MY_PROFILE, {name: 'user'}),
)(NavBarView);
