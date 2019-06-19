import React from 'react';
import {auth} from '../state/auth';
import {Container, Placeholder} from 'semantic-ui-react';

const CallbackView = ({history}) => {
  auth.handleAuthentication(history);
  return (
    <>
      <Placeholder fluid style={{height: 49, marginBottom: 50}}>
        <Placeholder.Image />
      </Placeholder>
      <Container>
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
