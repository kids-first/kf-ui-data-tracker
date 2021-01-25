import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';
import {
  Container,
  Dimmer,
  Header,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';
import {BucketsList} from '../../components/BucketsList';
import {GET_BUCKETS} from '../queries';

const BucketsView = () => {
  const {loading, error, data} = useQuery(GET_BUCKETS);
  const allBuckets = data && data.allBuckets;

  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - Buckets - Error</title>
        </Helmet>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Buckets</title>
      </Helmet>
      <Header>Study Buckets</Header>
      <Segment basic>
        Buckets are synced periodically with S3 and linked to studies
        automatically.
      </Segment>
      <Segment basic>
        {loading && (
          <Segment basic padded="very">
            <Dimmer active inverted>
              <Loader inverted>Loading buckets...</Loader>
            </Dimmer>
          </Segment>
        )}
        {!loading && allBuckets && <BucketsList buckets={allBuckets.edges} />}
      </Segment>
    </Container>
  );
};

export default BucketsView;
