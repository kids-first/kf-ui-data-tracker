import React from 'react';
import {useParams, Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Label,
  Segment,
  Statistic,
} from 'semantic-ui-react';
import {GET_BUCKET, BUCKET_LINES} from '../queries';
import {SizeGraph} from '../components/SizeGraph';
import {InventoryTable} from '../components/InventoryTable';
import {formatFileSize, formatLargeNumber} from '../../documents/utilities';

const BucketDetailView = ({match}) => {
  const {bucketName} = useParams();
  const {data: bucketSizeData, loading: bucketSizeLoading} = useQuery(
    BUCKET_LINES,
  );

  const {data: bucketData} = useQuery(GET_BUCKET, {
    variables: {id: Buffer.from('BucketNode:' + bucketName).toString('base64')},
  });

  const summary =
    bucketData &&
    bucketData.bucket.inventories.edges.length > 0 &&
    JSON.parse(bucketData.bucket.inventories.edges[0].node.summary);
  console.log(summary);

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

      {bucketSizeData && !bucketSizeLoading && (
        <SizeGraph color="#f2711c" data={bucketSizeData.bucketSize} />
      )}

      <Header>Bucket Stats</Header>
      {summary && (
        <Statistic.Group widths={2}>
          <Statistic
            value={formatLargeNumber(summary.total_count)}
            label="Total Objects"
          />
          <Statistic
            value={formatFileSize(summary.total_size, true)}
            label="Total Size"
          />
        </Statistic.Group>
      )}

      <Header>Bucket Info</Header>
      <Grid celled as={Segment} secondary textAlign="center" columns="equal">
        {[
          {name: 'Bucket Name', value: bucketData && bucketData.bucket.name},
          {name: 'AWS Account', value: 'Kids First Strides'},
          {
            name: 'Study',
            value:
              bucketData && bucketData.study
                ? bucketData.study.name
                : 'No study',
          },
        ].map(v => (
          <Grid.Column>
            <b>{v.name}:</b> {v.value}
          </Grid.Column>
        ))}
      </Grid>
      <Header>Bucket Health</Header>
      <Grid celled as={Segment} secondary textAlign="center">
        {['Encrypted', 'Readable', 'Replicating', 'Weekly Inventories'].map(
          v => (
            <Grid.Column width={4}>
              <Label empty circular color="green" /> {v}
            </Grid.Column>
          ),
        )}
      </Grid>

      <Header>Bucket Inventory History</Header>
      {bucketData && (
        <InventoryTable inventories={bucketData.bucket.inventories.edges} />
      )}
    </Container>
  );
};

export default BucketDetailView;
