import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';
import {useHistory} from 'react-router-dom';
import {Button, Container, Header, Segment} from 'semantic-ui-react';
import {MY_PROFILE} from '../../state/queries';
import {hasPermission} from '../../common/permissions';
import {ReleaseTable} from '../components/ReleaseTable';

const HomeView = ({match}) => {
  const history = useHistory();

  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Releases`}</title>
      </Helmet>

      {myProfile && hasPermission(myProfile, 'view_settings') && (
        <Button
          color="purple"
          labelPosition="left"
          floated="right"
          icon="tag"
          content="Run Release"
          onClick={() => history.push('/releases/history/new-release')}
        />
      )}
      <Header as="h1" className="noMargin">
        Latest Releases
      </Header>
      <ReleaseTable />
    </Container>
  );
};

export default HomeView;
