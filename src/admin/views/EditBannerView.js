import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {
  Container,
  Segment,
  Header,
  Message,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {UPDATE_BANNER} from '../mutations';
import {GET_BANNER, ALL_BANNERS} from '../queries';
import BannerForm from '../forms/BannerForm';

const EditBannerView = ({match}) => {
  // Fetch banner
  const {loading: bannerLoading, error: bannerError, data: banner} = useQuery(
    GET_BANNER,
    {
      variables: {id: match.params.bannerId},
    },
  );

  // Update banner mutation
  const [
    updateBanner,
    {loading: updateBannerLoading, error: updateBannerError},
  ] = useMutation(UPDATE_BANNER, {
    refetchQueries: [
      {query: ALL_BANNERS},
      {query: ALL_BANNERS, variables: {enabled: true}},
    ],
  });

  // Loading banner
  if (bannerLoading) {
    return (
      <Dimmer active inverted>
        <Loader active inverted>
          Loading Banner ...
        </Loader>
      </Dimmer>
    );
  }

  // Error fetching banner
  if (bannerError) {
    return <Message negative header="Error" content={bannerError.message} />;
  }

  // Banner form
  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Edit Banner`}</title>
      </Helmet>
      <Header as="h2">Edit Banner</Header>
      <Segment padded="very">
        <BannerForm
          isUpdate={true}
          banner={banner.banner}
          mutation={updateBanner}
          loading={updateBannerLoading}
          error={updateBannerError}
        />
      </Segment>
    </Container>
  );
};

export default EditBannerView;
