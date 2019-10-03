import React from 'react';
import {compose, graphql} from 'react-apollo';
import {Link} from 'react-router-dom';
import {ALL_STUDIES, MY_PROFILE} from '../state/queries';
import {AnalyticsViewConsumer} from '../analyticsTracking';
import StudyList from '../components/StudyList/StudyList';
import {Button, Message, Container, Segment} from 'semantic-ui-react';

const StudyListView = ({
  studies: {loading, allStudies, error},
  myProfile: {myProfile},
}) => {
  if (error)
    return (
      <AnalyticsViewConsumer
        status="ERROR"
        mountProperties={{error}}
        view="StudyListView"
      >
        <Container as={Segment} basic>
          <Message
            negative
            icon="warning circle"
            header="Error"
            content={error.message}
          />
        </Container>
      </AnalyticsViewConsumer>
    );
  const studyList = !loading ? allStudies.edges : [];
  if (!loading && studyList.length === 0)
    return (
      <Container as={Segment} basic>
        {myProfile && myProfile.roles.includes('ADMIN') ? (
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
                to={`/study/new-study`}
              />
            </Segment>
          </>
        ) : (
          <Message
            warning
            icon="warning circle"
            header="You don't have access to any studies yet."
            content="Your account is being reviewed for the proper permissions."
          />
        )}
      </Container>
    );
  return (
    <AnalyticsViewConsumer view="StudyListView">
      <StudyList
        studyList={studyList}
        loading={loading}
        roles={myProfile ? myProfile.roles : []}
      />
    </AnalyticsViewConsumer>
  );
};

export default compose(
  graphql(ALL_STUDIES, {name: 'studies'}),
  graphql(MY_PROFILE, {name: 'myProfile'}),
)(StudyListView);
