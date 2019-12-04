import React from 'react';
import {Helmet} from 'react-helmet';
import {Header, Image, Grid, Segment, Button, Icon} from 'semantic-ui-react';
import logo from '../assets/logo.svg';
import {ApolloConsumer} from '@apollo/react-common';
import {auth} from '../state/auth';

const LoginView = ({location, history}) => (
  <Grid
    stretched
    className="View--Login"
    textAlign="center"
    verticalAlign="middle"
  >
    <Helmet>
      <title>KF Data Tracker - Logout</title>
    </Helmet>
    <Grid.Column computer="8" tablet="12" mobile="15">
      <Segment>
        <Header as="h1">
          <Image src={logo} />
          <Header.Content>Kids First Data Tracker</Header.Content>
        </Header>
        <Header as="h3">You have been logged out successfully</Header>
        <ApolloConsumer>
          {client => (
            <Button
              className="mb-15"
              size="big"
              onClick={() =>
                auth.login(location.state ? location.state.from : '/', false)
              }
              positive
              icon
              labelPosition="right"
            >
              Click here to login
              <Icon name="chevron right" />
            </Button>
          )}
        </ApolloConsumer>
      </Segment>
    </Grid.Column>
  </Grid>
);

export default LoginView;
