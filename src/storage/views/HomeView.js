import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {Container, Grid, Header, Segment, Statistic} from 'semantic-ui-react';
import {ALL_BUCKETS, BUCKET_LINES, INVENTORY_STATS} from '../queries';
import {formatFileSize, formatLargeNumber} from '../../documents/utilities';
import {BucketList} from '../components/BucketList';
import {SizeGraph} from '../components/SizeGraph';
import {StatTable} from '../components/StatTable';

const HomeView = ({match}) => {
  const {data: bucketsData, loading: bucketsLoading} = useQuery(ALL_BUCKETS);
  const {data: bucketSizeData, loading: bucketSizeLoading} = useQuery(
    BUCKET_LINES,
  );
  const {data: statsData, loading: inventoryStatsLoading} = useQuery(
    INVENTORY_STATS,
  );

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>{`KF Data Tracker - Storage`}</title>
      </Helmet>
      <Header as="h1" className="noMargin">
        Storage Overview
      </Header>

      {bucketSizeData && !bucketSizeLoading && (
        <SizeGraph data={bucketSizeData.bucketSize} />
      )}

      {!inventoryStatsLoading && statsData && (
        <Statistic.Group widths={4}>
          <Statistic
            value={statsData.bucketInventoryStats.totalBuckets}
            label="Accounts"
          />
          <Statistic
            value={statsData.bucketInventoryStats.totalBuckets}
            label="Buckets"
          />
          <Statistic
            value={formatLargeNumber(
              statsData.bucketInventoryStats.totalObjects,
            )}
            label="Objects"
          />
          <Statistic
            value={formatFileSize(
              statsData.bucketInventoryStats.totalBytes,
              true,
            )}
            label="Data"
          />
        </Statistic.Group>
      )}

      {statsData && (
        <Grid as={Segment} basic celled>
          <Grid.Row>
            <Grid.Column width={4}>
              <Header size="small">By Count</Header>
              <StatTable
                valueLabel="Count"
                data={statsData.bucketInventoryStats.countByFileFormat}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Header size="small">By Size</Header>
              <StatTable
                valueLabel="Size"
                data={statsData.bucketInventoryStats.sizeByFileFormat}
                valueFormatter={data => formatFileSize(data, true)}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Header size="small">By Count</Header>
              <StatTable
                valueLabel="Count"
                data={statsData.bucketInventoryStats.countByFileFormat}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              <Header size="small">By Size</Header>
              <StatTable
                valueLabel="Size"
                data={statsData.bucketInventoryStats.sizeByFileFormat}
                valueFormatter={data => formatFileSize(data, true)}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}

      {bucketsData && !bucketsLoading && (
        <BucketList buckets={bucketsData.allBuckets.edges} />
      )}
    </Container>
  );
};

export default HomeView;
