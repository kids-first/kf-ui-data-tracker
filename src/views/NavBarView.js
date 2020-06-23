import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Route, Switch} from 'react-router-dom';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import {UPDATE_STUDY} from '../state/mutations';
import StudyHeader from '../components/StudyHeader/StudyHeader';
import {StudyNavBar} from '../components/StudyNavBar';
import {Container, Segment, Message} from 'semantic-ui-react';
import CreatingStudyModal from '../modals/CreatingStudyModal';
import {
  DocumentListHelp,
  DocumentDetailHelp,
} from '../documents/components/helpers';
import {hasPermission} from '../common/permissions';

const NavBarView = ({match, location, history}) => {
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      kfId: match.params.kfId,
    },
  });
  const studyByKfId = data && data.studyByKfId;
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const userRole =
    myProfile && myProfile.groups.edges.length > 0
      ? myProfile.groups.edges.map(({node}) => node.name)
      : [];
  const isBeta = userRole.includes('Administrators');
  const allowEdit = myProfile && hasPermission(myProfile, 'change_study');

  const [updateStudy] = useMutation(UPDATE_STUDY);

  const newStudy =
    sessionStorage.getItem('newStudy') &&
    sessionStorage
      .getItem('newStudy')
      .split(',')
      .filter(id => id.includes(match.params.kfId));

  const [showModal, setShowModal] = useState(false);

  const isResearch = match.path.includes('research');

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
          study={studyByKfId}
          loading={loading}
          showModal={setShowModal}
          newStudy={newStudy}
          updateStudy={allowEdit && updateStudy}
        />
      </Segment>
      <Container>
        <StudyNavBar isBeta={isBeta} isResearch={isResearch} />
        <Switch>
          <Route
            exact
            path="/study/:kfId/documents"
            component={DocumentListHelp}
          />
          <Route
            exact
            path="/study/:kfId/documents/:fileId(SF_\w{8})"
            component={DocumentDetailHelp}
          />
        </Switch>
      </Container>
      {newStudy && (
        <CreatingStudyModal
          displaying={
            (studyByKfId && location.state && location.state.newStudy) ||
            showModal
          }
          studyKfId={studyByKfId && studyByKfId.kfId}
          history={history}
          closeModal={setShowModal}
          isResearch={isResearch}
        />
      )}
    </section>
  );
};

export default NavBarView;
