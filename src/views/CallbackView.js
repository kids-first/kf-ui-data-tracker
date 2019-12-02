import React from 'react';
import {Helmet} from 'react-helmet';
import {auth} from '../state/auth';
import {Container, Segment, Placeholder} from 'semantic-ui-react';

const CallbackView = ({history}) => {
  auth.handleAuthentication(history);
  return (
    <>
      <Helmet>
        <title>KF Data Tracker - Forwarding</title>
      </Helmet>
      <Placeholder fluid className="height-50">
        <Placeholder.Image />
      </Placeholder>
      <Container as={Segment} basic>
        <Placeholder fluid>
          <Placeholder.Header>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Container>
    </>
  );
};

export default CallbackView;
