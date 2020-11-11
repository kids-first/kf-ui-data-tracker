import React from 'react';
import {useParams, Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {Button, Container, Header, Icon, Segment} from 'semantic-ui-react';
import {GET_BUCKET} from '../queries';
import {InventoryTable} from '../components/InventoryTable';

const BucketDetailView = ({match}) => {
  const {bucketName} = useParams();

  const {data: bucketData} = useQuery(GET_BUCKET, {
    variables: {id: Buffer.from('BucketNode:' + bucketName).toString('base64')},
  });

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>{`KF Data Tracker - Bucket ${bucketName}`}</title>
      </Helmet>
      <Link to={`/storage`}>
        <Button basic labelPosition="left" floated="left">
          <Icon name="arrow left" />
          Storage Overview
        </Button>
      </Link>
      <Header as="h1">{bucketName}</Header>

      <Header>Bucket Inventory History</Header>
      {bucketData && (
        <InventoryTable inventories={bucketData.bucket.inventories.edges} />
      )}
    </Container>
  );
};

export default BucketDetailView;
