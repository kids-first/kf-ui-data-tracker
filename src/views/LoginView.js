import React from 'react';
import {Header, Icon, Grid, Message, Segment} from 'semantic-ui-react';
import {Login} from '../components/Login';

const LoginView = () => {
  return (
    <Grid
      className="View--Login"
      textAlign="center"
      style={{height: '90vh'}}
      verticalAlign="middle"
    >
      <Grid.Column width="7">
        <Segment>
          <Header as="h1">Kids First Data Tracker</Header>
          <Login />
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
