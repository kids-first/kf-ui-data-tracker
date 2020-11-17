import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {
  Container,
  Grid,
  Header,
  Input,
  Segment,
  Statistic,
} from 'semantic-ui-react';
import {ALL_BUCKETS, BUCKET_LINES, INVENTORY_STATS} from '../queries';
import {formatFileSize, formatLargeNumber} from '../../documents/utilities';
import {BucketTable} from '../components/BucketTable';
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

  const [searchString, setSearchString] = useState('');

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>{`KF Data Tracker - Storage`}</title>
      </Helmet>
      <Header as="h1" className="noMargin">
        Storage Overview
      </Header>

      {bucketSizeData &&
        bucketSizeData.bucketSize.length > 0 &&
        !bucketSizeLoading && <SizeGraph data={bucketSizeData.bucketSize} />}

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
        <Segment vertical>
          <Grid>
            <Grid.Column width="8" verticalAlign="middle">
              <Header>All Buckets</Header>
            </Grid.Column>
            <Grid.Column width="8" textAlign="right">
              <Input
                fluid
                name="searchString"
                icon="search"
                placeholder="Filter by name"
                value={searchString}
                onChange={(e, {value}) => setSearchString(value)}
              />
            </Grid.Column>
          </Grid>
          <BucketTable
            buckets={bucketsData.allBuckets.edges}
            searchString={searchString}
          />
        </Segment>
      )}
    </Container>
  );
};

export default HomeView;
