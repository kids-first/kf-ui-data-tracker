import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import StudyHeader from '../components/StudyHeader/StudyHeader';
import {StudyNavBar} from '../components/StudyNavBar';
import {Container, Segment, Message} from 'semantic-ui-react';
import CreatingStudyModal from '../modals/CreatingStudyModal';

const NavBarView = ({match, location, history}) => {
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      kfId: match.params.kfId,
    },
  });
  const studyByKfId = data && data.studyByKfId;
  const user = useQuery(MY_PROFILE);

  const [showModal, setShowModal] = useState(false);

  const isBeta =
    !user.loading && user.data.myProfile
      ? user.data.myProfile.roles.includes('BETA')
      : false;

  const creationError =
    studyByKfId &&
    studyByKfId.events &&
    studyByKfId.events.edges.filter(({node}) =>
      node.eventType.includes('_ERR'),
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
  return (
    <section id="study">
      <Segment secondary basic>
        <StudyHeader
          {...studyByKfId}
          loading={loading}
          creationError={creationError}
          showModal={setShowModal}
        />
      </Segment>
      <Container>
        <StudyNavBar isBeta={isBeta} />
      </Container>
      {((studyByKfId && location.state && location.state.newStudy) ||
        showModal) && (
        <CreatingStudyModal
          studyKfId={studyByKfId.kfId}
          history={history}
          closeModal={setShowModal}
        />
      )}
    </section>
  );
};

export default NavBarView;
