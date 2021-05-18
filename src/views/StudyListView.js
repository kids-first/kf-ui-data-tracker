import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';
import {Link, Redirect} from 'react-router-dom';
import {ALL_STUDIES, MY_PROFILE} from '../state/queries';
import StudyList from '../components/StudyList/StudyList';
import {Button, Message, Container, Segment} from 'semantic-ui-react';
import {hasPermission} from '../common/permissions';
import bug from '../assets/bug.svg';
import {ImageMessage} from '../components/ImageMessage';

const StudyListView = ({history}) => {
  var currentOrg;
  try {
    currentOrg = JSON.parse(localStorage.getItem('currentOrganization'));
  } catch (e) {
    currentOrg = null;
  }

  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  // Need to fetch from network everytime or else the allStudies query to the
  // release coordinator will overwrite the result in the cache
  const {loading, error, data} = useQuery(ALL_STUDIES, {
    fetchPolicy: 'cache-first',
    variables: {
      organization: currentOrg && currentOrg.id,
    },
  });
  const allStudies = data && data.allStudies;

  var studyList = allStudies ? allStudies.edges : [];

  // Flatten the latest release into the top of the study as 'release'
  studyList = studyList.map(({node}) => {
    const release = node.releases.edges.length && node.releases.edges[0];
    return {node: {...node, release}};
  });

  if (
    myProfile &&
    !hasPermission(myProfile, 'view_study') &&
    !hasPermission(myProfile, 'view_my_study')
  ) {
    return (
      <Redirect
        to={{
          pathname: '/welcome',
        }}
      />
    );
  }
  if (error) {
    console.log('Error loading studies:', error);
    return (
      <ImageMessage
        image={bug}
        title="There was a problem retrieving studies"
        message={
          <>
            You may not have been granted permissions for studies or there may
            be a more serious error on our side. Please contact us at{' '}
            <a href="mailto:support@kidsfirstdrc.org">
              support@kidsfirstdrc.org
            </a>
          </>
        }
      />
    );
  }

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
    </>
  );
};

export default StudyListView;
