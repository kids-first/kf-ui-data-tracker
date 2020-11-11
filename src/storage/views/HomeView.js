import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {Container, Header, Segment, Statistic} from 'semantic-ui-react';
import {ALL_BUCKETS, BUCKET_LINES, INVENTORY_STATS} from '../queries';
import {formatFileSize, formatLargeNumber} from '../../documents/utilities';
import {BucketList} from '../components/BucketList';
import {SizeGraph} from '../components/SizeGraph';

const HomeView = ({match}) => {
  const {data: bucketsData, loading: bucketsLoading} = useQuery(ALL_BUCKETS);
  const {data: bucketSizeData, loading: bucketSizeLoading} = useQuery(
    BUCKET_LINES,
  );
  const {data: inventoryStatsData, loading: inventoryStatsLoading} = useQuery(
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

      {!inventoryStatsLoading && inventoryStatsData && (
        <Statistic.Group widths={4}>
          <Statistic
            value={inventoryStatsData.bucketInventoryStats.totalBuckets}
            label="Accounts"
          />
          <Statistic
            value={inventoryStatsData.bucketInventoryStats.totalBuckets}
            label="Buckets"
          />
          <Statistic
            value={formatLargeNumber(
              inventoryStatsData.bucketInventoryStats.totalObjects,
            )}
            label="Objects"
          />
          <Statistic
            value={formatFileSize(
              inventoryStatsData.bucketInventoryStats.totalBytes,
              true,
            )}
            label="Data"
          />
        </Statistic.Group>
      )}
      {bucketsData && !bucketsLoading && (
        <BucketList buckets={bucketsData.allBuckets.edges} />
      )}
    </Container>
  );
};

export default HomeView;
