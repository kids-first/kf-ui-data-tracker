import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import {UPDATE_STUDY} from '../state/mutations';
import StudyInfo from '../components/StudyInfo/StudyInfo';
import {Container, Segment, Message, Placeholder} from 'semantic-ui-react';
import EmptyView from './EmptyView';
import EditStudyModal from '../modals/EditStudyModal';
import NewProjectModal from '../modals/NewProjectModal';

const StudyInfoView = ({
  study: {loading, studyByKfId, error},
  user,
  updateStudy,
}) => {
  const isBeta = !user.loading ? user.myProfile.roles.includes('BETA') : false;
  const [showModal, setShowModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

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
        <StudyInfo
          studyNode={studyByKfId}
          setShowModal={setShowModal}
          setShowNewProjectModal={setShowNewProjectModal}
        />
        {showModal && (
          <EditStudyModal
            updateStudy={updateStudy}
            studyNode={studyByKfId}
            onCloseDialog={() => setShowModal(false)}
          />
        )}
        {showNewProjectModal && (
          <NewProjectModal
            study={studyByKfId}
            onCloseDialog={() => setShowNewProjectModal(false)}
          />
        )}
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
