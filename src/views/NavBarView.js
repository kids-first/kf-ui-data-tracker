import {
  CollaboratorsHelp,
  DataValidationHelp,
  DocumentDetailHelp,
  DocumentListHelp,
  ReviewDetailHelp,
  ReviewListHelp,
} from '../documents/components/helpers';
import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/client';
import {Route, Switch} from 'react-router-dom';
import {GET_STUDY_BY_ID, MY_PROFILE} from '../state/queries';
import {UPDATE_STUDY} from '../state/mutations';
import StudyHeader from '../components/StudyHeader/StudyHeader';
import {StudyNavBar} from '../components/StudyNavBar';
import {Container, Segment, Message} from 'semantic-ui-react';
import CreatingStudyModal from '../modals/CreatingStudyModal';
import {hasPermission} from '../common/permissions';

const NavBarView = ({match, location, history}) => {
  const relayId = Buffer.from('StudyNode:' + match.params.kfId).toString(
    'base64',
  );
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: relayId,
    },
  });
  const study = data && data.study;
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

  if (
    location.pathname.includes('/versions/') ||
    location.pathname.includes('/upload')
  ) {
    return <></>;
  }

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
      <Segment basic className="science-bg">
        <StudyHeader
          study={study}
          loading={loading}
          showModal={setShowModal}
          newStudy={newStudy}
          updateStudy={allowEdit && updateStudy}
        />
      </Segment>
      <Container>
        {!location.pathname.includes('/start-review') && (
          <StudyNavBar isBeta={isBeta} />
        )}
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
          <Route
            path="/study/:kfId/collaborators"
            component={CollaboratorsHelp}
          />
          <Route exact path="/study/:kfId/reviews" component={ReviewListHelp} />
          <Route
            exact
            path="/study/:kfId/reviews/:reviewId(DR_\w{8})"
            component={ReviewDetailHelp}
          />
          <Route
            exact
            path="/study/:kfId/reviews/:reviewId(DR_\w{8})/validation"
            component={DataValidationHelp}
          />
        </Switch>
      </Container>
      {newStudy && (
        <CreatingStudyModal
          displaying={
            (study && location.state && location.state.newStudy) || showModal
          }
          studyKfId={study && study.kfId}
          history={history}
          closeModal={setShowModal}
        />
      )}
    </section>
  );
};

export default NavBarView;
