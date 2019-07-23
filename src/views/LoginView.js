import React from 'react';
import {Header, Icon, Image, Grid, Message, Segment} from 'semantic-ui-react';
import {LoginCard} from '../components/LoginCard';
import logo from '../assets/logo.svg';

const LoginView = ({location}) => {
  return (
    <Grid
      stretched
      className="View--Login"
      textAlign="center"
      verticalAlign="middle"
    >
      <Grid.Column computer="8" tablet="12" mobile="15">
        <Segment>
          <Header as="h1">
            <Image src={logo} />
            <Header.Content>Kids First Data Tracker</Header.Content>
          </Header>
          <LoginCard originalUrl={location.state ? location.state.from : '/'} />
          <Message>
            New to Kids First Data Tracker?
            <a href="/">
              Join now <Icon name="chevron right" />
            </a>
          </Message>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default LoginView;
