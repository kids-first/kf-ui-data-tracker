import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import StudyHeader from '../components/StudyHeader/StudyHeader';
import {StudyNavBar} from '../components/StudyNavBar';
import {Container, Segment, Message} from 'semantic-ui-react';

const NavBarView = ({match}) => {
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      kfId: match.params.kfId,
    },
  });
  const studyByKfId = data && data.studyByKfId;
  const user = useQuery(MY_PROFILE);

  const isBeta =
    !user.loading && user.data.myProfile
      ? user.data.myProfile.roles.includes('BETA')
      : false;

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

export default NavBarView;
