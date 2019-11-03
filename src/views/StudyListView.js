import React from 'react';
import {compose, graphql} from 'react-apollo';
import {Link} from 'react-router-dom';
import {ALL_STUDIES, MY_PROFILE} from '../state/queries';
import StudyList from '../components/StudyList/StudyList';
import {Button, Message, Container, Segment} from 'semantic-ui-react';
import {withAnalyticsTracking} from '../analyticsTracking';

const StudyListView = ({
  studies: {loading, allStudies, error},
  myProfile: {myProfile},
}) => {
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
                {...buttonTracking({
                  button_text: 'Create Study',
                  link: `/study/new-study`,
                })}
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
    <StudyList
      studyList={studyList}
      loading={loading}
      roles={myProfile ? myProfile.roles : []}
    />
  );
};

export default compose(
  graphql(ALL_STUDIES, {name: 'studies'}),
  graphql(MY_PROFILE, {name: 'myProfile'}),
)(StudyListView);
