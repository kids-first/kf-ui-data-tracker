import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {useHistory} from 'react-router-dom';
import {Segment, Container, Button, Header} from 'semantic-ui-react';
import {ServiceList} from '../components/ServiceList';
import {MY_PROFILE} from '../../state/queries';
import {ALL_SERVICES} from '../queries';
import {hasPermission} from '../../common/permissions';

const ServicesListView = props => {
  const history = useHistory();

  const {
    loading: servicesLoading,
    error: servicesError,
    data: services,
  } = useQuery(ALL_SERVICES, {
    context: {clientName: 'coordinator'},
  });

  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Release Services`}</title>
      </Helmet>
      {myProfile && hasPermission(myProfile, 'view_settings') && (
        <Button
          color="purple"
          labelPosition="left"
          floated="right"
          icon="tag"
          content="Register a Service"
          onClick={() => history.push('/releases/services/new-service')}
        />
      )}
      <Header as="h1" className="noMargin">
        Release Task Services
        <span className="text-14 text-normal">
          {' '}(Most recent 20 services)
        </span>
      </Header>
      <ServiceList
        services={services && services.allTaskServices.edges}
        loading={servicesLoading}
        error={servicesError}
      />
    </Container>
  );
};

export default ServicesListView;
