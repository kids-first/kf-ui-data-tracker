import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Container, Segment, Dimmer, Loader, Message} from 'semantic-ui-react';
import {GET_RELEASES} from '../queries';
import {ReleaseList} from '../components/ReleaseList';

const HomeView = ({match}) => {
  const {data: releaseData, loading: releaseLoading} = useQuery(GET_RELEASES, {
    context: {clientName: 'coordinator'},
  });
  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Releases`}</title>
      </Helmet>
      <ReleaseList
        loading={releaseLoading}
        releases={releaseData && releaseData.allReleases.edges}
      />
    </Container>
  );
};

export default HomeView;
