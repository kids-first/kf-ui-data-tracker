import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {Container, Grid, Header, Segment} from 'semantic-ui-react';
import {LATEST_RELEASE, GET_RELEASES} from '../queries';
import {AdminMenu} from '../components/AdminMenu';
import {ReleaseHeader} from '../components/ReleaseHeader';
import {ReleaseTable} from '../components/ReleaseTable';

const HomeView = ({match}) => {
  const {data: releaseData} = useQuery(GET_RELEASES, {
    context: {clientName: 'coordinator'},
  });

  const {data: latestReleaseData, loading: latestReleaseLoading} = useQuery(
    LATEST_RELEASE,
    {
      context: {clientName: 'coordinator'},
    },
  );
  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Releases`}</title>
      </Helmet>
      <Header as="h1">Data Releases</Header>

      <ReleaseHeader
        loading={latestReleaseLoading}
        release={
          latestReleaseData && latestReleaseData.allReleases.edges[0].node
        }
      />

      <Grid relaxed="very">
        <Grid.Column width={3}>
          <AdminMenu />
        </Grid.Column>
        <Grid.Column width={13}>
          <Header>Latest Releases</Header>
          <ReleaseTable
            releases={releaseData && releaseData.allReleases.edges}
          />
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default HomeView;
