import React from 'react';
import {Header, Icon, Grid, Message, Segment} from 'semantic-ui-react';
import {LoginCard} from '../components/LoginCard';

const LoginView = () => {
  return (
    <Grid
      stretched
      className="View--Login"
      textAlign="center"
      style={{height: '90vh'}}
      verticalAlign="middle"
    >
      <Grid.Column computer="8" tablet="12" mobile="15">
        <Segment>
          <Header as="h1">Kids First Data Tracker</Header>
          <LoginCard />
          <Message>
            New to Kids First Data Tracker?
            <a className="no-underline" href="/">
              Join now <Icon name="chevron right" />
            </a>
          </Message>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default LoginView;
