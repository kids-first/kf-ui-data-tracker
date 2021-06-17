import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {
  Container,
  Dimmer,
  Divider,
  Header,
  Loader,
  Segment,
} from 'semantic-ui-react';
import {OrganizationList} from '../components/OrganizationList';
import {ALL_ORGANIZATIONS} from '../queries';
import {UPDATE_ORGANIZATION} from '../mutations';
import {MY_PROFILE} from '../../state/queries';

const OrganizationsView = () => {
  const {loading: orgsLoading, data: orgsData} = useQuery(ALL_ORGANIZATIONS);

  const {data: myProfileData} = useQuery(MY_PROFILE);
  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);
  const profile = myProfileData && myProfileData.myProfile;

  const permissions =
    profile &&
    profile.groups &&
    profile.groups.edges &&
    profile.groups.edges
      .map(({node}) => node.permissions.edges.map(({node}) => node.codename))
      .reduce((prev, curr) => prev.concat(curr));

  const canUpdate = permissions && permissions.includes('change_organization');

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Organizations</title>
      </Helmet>
      <Header as="h3">Data Tracker Organizations</Header>
      <Segment basic>
        Manage all organizations registered in the Data Tracker.
      </Segment>
      <Segment basic>
        <Header as="h4">Organizations</Header>
        <Divider />
        {orgsLoading ? (
          <Segment basic padded="very">
            <Dimmer active inverted>
              <Loader inverted>Loading organizations...</Loader>
            </Dimmer>
          </Segment>
        ) : (
          <>
            {orgsData ? (
              <OrganizationList
                organizations={orgsData.allOrganizations.edges}
                updateOrganization={canUpdate && updateOrganization}
              />
            ) : (
              <p>No organizations available</p>
            )}
          </>
        )}
      </Segment>
    </Container>
  );
};

export default OrganizationsView;
