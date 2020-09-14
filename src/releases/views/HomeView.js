import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {Container, Header, Segment} from 'semantic-ui-react';
import {GET_RELEASES} from '../queries';
import {ReleaseTable} from '../components/ReleaseTable';

const HomeView = ({match}) => {
  const {data: releaseData} = useQuery(GET_RELEASES, {
    context: {clientName: 'coordinator'},
  });

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Releases`}</title>
      </Helmet>

      <Header as="h1">Latest Releases</Header>
      <ReleaseTable releases={releaseData && releaseData.allReleases.edges} />
    </Container>
  );
};

export default HomeView;
