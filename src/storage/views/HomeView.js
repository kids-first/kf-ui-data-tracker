import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Segment,
  Statistic,
} from 'semantic-ui-react';
import {ALL_BUCKETS, BUCKET_LINES, INVENTORY_STATS} from '../queries';
import {formatFileSize, formatLargeNumber} from '../../documents/utilities';
import {BucketTable} from '../components/BucketTable';
import {SizeGraph} from '../components/SizeGraph';
import {StatTable} from '../components/StatTable';
import {HomeHelp} from '../components/helpers';

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
      <HomeHelp />
      <Header as="h1">Storage Overview</Header>

      {bucketSizeData &&
        bucketSizeData.bucketSize.length > 0 &&
        !bucketSizeLoading && (
          <SizeGraph color="#f2711c" data={bucketSizeData.bucketSize} />
        )}

      {!inventoryStatsLoading && statsData && (
        <Statistic.Group widths={3}>
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
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header>
                File Formats
                <Header.Subheader>
                  Aggregates by extension. Extranous file annotations have been
                  compressed and substituted with the overall extension.
                </Header.Subheader>
              </Header>
              <StatTable
                labelMap={{true: 'New', false: 'Old'}}
                sizeData={statsData.bucketInventoryStats.sizeByExtension}
                countData={statsData.bucketInventoryStats.countByExtension}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Header>
                Folders
                <Header.Subheader>
                  Top level directories within buckets. Objects stored on the
                  top of the bucket directory are aggregated under `/`.
                </Header.Subheader>
              </Header>
              <StatTable
                labelMap={{true: 'New', false: 'Old'}}
                sizeData={statsData.bucketInventoryStats.sizeByTopFolder.slice(
                  0,
                  6,
                )}
                countData={statsData.bucketInventoryStats.countByTopFolder}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column computer={4} tablet={8} mobile={16}>
              <Header>
                Versions
                <Header.Subheader>
                  The number of objects marked as latest vs those that have been
                  superseded.
                </Header.Subheader>
              </Header>
              <StatTable
                labelMap={{true: 'New', false: 'Old'}}
                sizeData={statsData.bucketInventoryStats.sizeByIsLatest}
                countData={statsData.bucketInventoryStats.countByIsLatest}
              />
            </Grid.Column>
            <Grid.Column computer={4} tablet={8} mobile={16}>
              <Header>
                Storage Class
                <Header.Subheader>
                  The level at which objects are being stored in S3.
                </Header.Subheader>
              </Header>
              <StatTable
                labelMap={{STANDARD: 'Standard', GLACIER: 'Glacier'}}
                sizeData={statsData.bucketInventoryStats.sizeByStorageClass}
                countData={statsData.bucketInventoryStats.countByStorageClass}
              />
            </Grid.Column>
            <Grid.Column computer={4} tablet={8} mobile={16}>
              <Header>
                Replication Status
                <Header.Subheader>
                  Objects that have been replicated to data recovery buckets
                </Header.Subheader>
              </Header>
              <StatTable
                labelMap={{
                  COMPLETED: 'Completed',
                  FAILED: (
                    <>
                      <Icon name="warning sign" />
                      Failed
                    </>
                  ),
                  '': 'N/A',
                }}
                sizeData={
                  statsData.bucketInventoryStats.sizeByReplicationStatus
                }
                countData={
                  statsData.bucketInventoryStats.countByReplicationStatus
                }
              />
            </Grid.Column>
            <Grid.Column computer={4} tablet={8} mobile={16}>
              <Header>
                Encryption Status
                <Header.Subheader>
                  Status of Server Side Encryption of objects.
                </Header.Subheader>
              </Header>
              <StatTable
                labelMap={{
                  'SSE-S3': 'S3 Key',
                  'SSE-KMS': 'KMS Key',
                  'NOT-SSE': (
                    <>
                      <Icon name="warning sign" />
                      None
                    </>
                  ),
                }}
                sizeData={statsData.bucketInventoryStats.sizeByEncryptionStatus}
                countData={
                  statsData.bucketInventoryStats.countByEncryptionStatus
                }
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}

      <Divider />
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
