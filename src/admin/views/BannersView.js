import React from 'react';
import {Helmet} from 'react-helmet';
import {useHistory} from 'react-router-dom';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {Message, Button, Container, Header, Segment} from 'semantic-ui-react';

import {hasPermission} from '../../common/permissions';
import {MY_PROFILE} from '../../state/queries';
import {ALL_BANNERS} from '../queries';
import {DELETE_BANNER} from '../mutations';
import {BannerTable} from '../components/BannerTable';

const BannersView = () => {
  const history = useHistory();
  const {loading, error, data} = useQuery(ALL_BANNERS);
  const {data: profileData} = useQuery(MY_PROFILE);
  const [deleteBanner] = useMutation(DELETE_BANNER, {
    refetchQueries: [
      {query: ALL_BANNERS},
      {query: ALL_BANNERS, variables: {enabled: true}},
    ],
  });
  const myProfile = profileData && profileData.myProfile;

  const handleDelete = (banner) => {
    if (myProfile && hasPermission(myProfile, 'delete_banner')) {
      deleteBanner({variables: {id: banner}});
    } else {
      return null;
    }
  };

  const handleEdit = (banner) => {
    if (myProfile && hasPermission(myProfile, 'change_banner')) {
      history.push(`/banners/edit/${banner}`);
    } else {
      return null;
    }
  };

  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Banners </title>
      </Helmet>
      <Header as="h2">Manage App Banners</Header>
      <Segment basic vertical>
        Administrators can add message banners that will be persistently
        displayed on Data Tracker, informing users of anything important (e.g.
        scheduled downtime, new feature announcement).
        <br />
        <br />A banner will begin being displayed on the start date at midnight,
        and stop being displayed on midnight of the end date. Only the latest
        two (sorted by start date) enabled banners will be displayed at any
        given time.
        {error && (
          <Message
            negative
            icon="warning circle"
            header="Error"
            content={error.message}
          />
        )}
      </Segment>

      {/* Add banner button */}
      {myProfile && hasPermission(myProfile, 'add_banner') && (
        <Button
          color="blue"
          labelPosition="right"
          floated="right"
          icon="plus"
          content="Add Banner"
          onClick={() => history.push('/banners/new-banner')}
        />
      )}
      <Header as="h3">Banners</Header>

      {/* Banners Table */}
      {!error && (
        <BannerTable
          error={error}
          loading={loading}
          banners={data && data.allBanners.edges}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      )}
    </Container>
  );
};

export default BannersView;
