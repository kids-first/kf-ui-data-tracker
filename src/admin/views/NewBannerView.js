import React from 'react';
import {Helmet} from 'react-helmet';
import {useMutation} from '@apollo/client';
import {Container, Segment, Header} from 'semantic-ui-react';
import {CREATE_BANNER} from '../mutations';
import {ALL_BANNERS} from '../queries';
import BannerForm from '../forms/BannerForm';

const NewBannerView = (props) => {
  const [createBanner, {loading, error}] = useMutation(CREATE_BANNER, {
    refetchQueries: [
      {query: ALL_BANNERS},
      {query: ALL_BANNERS, variables: {enabled: true}},
    ],
  });

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - New Banner`}</title>
      </Helmet>
      <Header as="h2">Add New Banner</Header>
      <Segment padded="very">
        <BannerForm
          isUpdate={false}
          banner={{
            message: '',
            enabled: false,
            startDate: '',
            endDate: '',
            url: '',
            urlLabel: '',
            severity: 'INFO',
          }}
          mutation={createBanner}
          loading={loading}
          error={error}
        />
      </Segment>
    </Container>
  );
};

export default NewBannerView;
