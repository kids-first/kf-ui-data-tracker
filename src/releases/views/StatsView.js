import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';
import {BASIC_RELEASES} from '../queries';
import {Container, Header, Loader, Segment} from 'semantic-ui-react';
import {ReleaseBarChart} from '../components/ReleaseBarChart';
import {ReleaseActivity} from '../components/ReleaseActivity';

const StatsView = ({match}) => {
  const {
    data: releasesData,
    loading: releasesLoading,
  } = useQuery(BASIC_RELEASES, {fetchPolicy: 'network-only'});

  const releases =
    releasesData && releasesData.allReleases.edges.map(({node}) => node);

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Releases`}</title>
      </Helmet>

      <Header as="h1" className="noMargin">
        Release Statistics
      </Header>
      <Header as="h2" className="noMargin">
        Releases this year
      </Header>
      <Segment basic className="calendar">
        <Loader active={releasesLoading}>Loading release activity...</Loader>
        {!releasesLoading && <ReleaseActivity data={releases} />}
      </Segment>
      <Header as="h2" className="noMargin">
        Release Activity
      </Header>
      <Segment basic className="chart">
        <Loader active={releasesLoading}>Loading release activity...</Loader>
        {!releasesLoading && <ReleaseBarChart data={releases} />}
      </Segment>
    </Container>
  );
};

export default StatsView;
