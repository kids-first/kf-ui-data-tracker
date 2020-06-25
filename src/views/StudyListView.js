import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';
import {Link, Redirect} from 'react-router-dom';
import {ALL_STUDIES, MY_PROFILE, GET_RELEASED_STUDY} from '../state/queries';
import StudyList from '../components/StudyList/StudyList';
import {Button, Message, Container, Segment, Icon} from 'semantic-ui-react';
import {hasPermission} from '../common/permissions';

const StudyListView = ({history}) => {
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  // Need to fetch from network everytime or else the allStudies query to the
  // release coordinator will overwrite the result in the cache
  const {loading, error, data} = useQuery(ALL_STUDIES, {
    fetchPolicy: 'network-only',
  });
  const {error: releasesError, data: releasesData} = useQuery(
    GET_RELEASED_STUDY,
    {
      context: {clientName: 'coordinator'},
    },
  );
  const allStudies = data && data.allStudies;

  const allReleases = releasesData && releasesData.allStudyReleases;
  var studyList =
    !loading && allStudies ? JSON.parse(JSON.stringify(allStudies.edges)) : [];
  const releaseList = allReleases ? allReleases.edges : [];

  if (releaseList.length > 0 && studyList.length > 0) {
    studyList.forEach(function(study) {
      const release =
        releaseList.find(r => r.node.kfId === study.node.kfId) || {};
      study.node.release =
        release.node && release.node.releases.edges.length > 0
          ? release.node.releases.edges[0]
          : {};
    });
  }

  if (
    myProfile &&
    (!hasPermission(myProfile, 'view_study') &&
      !hasPermission(myProfile, 'view_my_study'))
  ) {
    return (
      <Redirect
        to={{
          pathname: '/welcome',
        }}
      />
    );
  }
  if (error)
    return (
      <Container as={Segment} basic>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {error && <p>{error.message}</p>}
            {releasesError && <p>{releasesError.message}</p>}
          </Message.Content>
        </Message>
      </Container>
    );

  if (
    myProfile &&
    !(
      hasPermission(myProfile, 'view_study') ||
      hasPermission(myProfile, 'view_my_study')
    )
  ) {
    return (
      <Container as={Segment} basic padded="very">
        <Helmet>
          <title>KF Data Tracker - My Studies</title>
        </Helmet>
        <Message
          warning
          icon="warning circle"
          header="You don't have access to any studies yet."
          content="Your account is being reviewed for the proper permissions."
        />
      </Container>
    );
  }
  if (!loading && studyList.length === 0)
    return (
      <Container as={Segment} basic padded="very">
        <Helmet>
          <title>KF Data Tracker - My Studies</title>
        </Helmet>
        {myProfile && hasPermission(myProfile, 'add_study') ? (
          <>
            <Message
              info
              icon="info circle"
              header="No studies yet."
              content="Create the first study to initialize the Data Resource Center"
            />
            <Segment basic textAlign="center">
              <Button
                basic
                primary
                size="large"
                icon="add"
                content="Create Study"
                as={Link}
                to={`/study/new-study/info`}
              />
            </Segment>
          </>
        ) : (
          <Message
            warning
            icon="warning circle"
            header="You don't have any studies yet."
            content="Your study will show up here once added to your account."
          />
        )}
      </Container>
    );
  return (
    <>
      <Helmet>
        <title>KF Data Tracker - My Studies</title>
      </Helmet>
      <StudyList
        studyList={studyList}
        loading={loading}
        history={history}
        myProfile={myProfile}
      />
      <Container as={Segment} basic vertical>
        {releasesError && (
          <Message negative icon>
            <Icon name="warning circle" />
            <Message.Content>
              <Message.Header>Releases Info Error</Message.Header>
              {releasesError.message}
            </Message.Content>
          </Message>
        )}
      </Container>
    </>
  );
};

export default StudyListView;
