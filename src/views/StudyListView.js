import React from 'react';
import {graphql} from 'react-apollo';
import {ALL_STUDIES} from '../state/queries';
import StudyList from '../components/StudyList/StudyList';
import {Message, Container, Segment} from 'semantic-ui-react';

const StudyListView = ({studies: {loading, allStudies, error}}) => {
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
        <Message
          warning
          icon="warning circle"
          header="You don't have access to any studies yet."
          content="Your account is being reviewed for the proper permissions."
        />
      </Container>
    );
  return <StudyList studyList={studyList} loading={loading} />;
};

export default graphql(ALL_STUDIES, {name: 'studies'})(StudyListView);
