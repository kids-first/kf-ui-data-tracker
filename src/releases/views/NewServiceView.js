import React from 'react';
import {useMutation} from '@apollo/react-hooks';
import {Container, Segment} from 'semantic-ui-react';
import {CREATE_SERVICE} from '../mutations';
import {ALL_SERVICES} from '../queries';
import WrappedNewServiceForm from '../forms/NewServiceForm';

const NewServiceView = props => {
  const [createService, {loading, error}] = useMutation(CREATE_SERVICE, {
    context: {clientName: 'coordinator'},
    refetchQueries: [
      {query: ALL_SERVICES, context: {clientName: 'coordinator'}},
    ],
  });

  return (
    <Container as={Segment} basic vertical>
      <WrappedNewServiceForm
        createService={createService}
        loading={loading}
        error={error}
      />
    </Container>
  );
};

export default NewServiceView;
