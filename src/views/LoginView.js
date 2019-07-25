import React from 'react';
import { Header, Icon, Image, Grid, Responsive, Segment } from 'semantic-ui-react';
import { LoginCard } from '../components/LoginCard';
import logo from '../assets/logo.svg';


const LoginView = () => {
  return (
    <section className="View--Login">
      <Grid
        centered
        className="h-screen"
      >
        <Grid.Row verticalAlign="middle" >

          <Grid.Column widescreen={3} computer={5} tablet={8} mobile={14} textAlign="center">
            <Header as="h1">
              <Image src={logo} />
              <Header.Content>Kids First Data Tracker</Header.Content>
            </Header>

            <Segment.Group raised >
              <Segment padded>
                <Header as="h3"> Log In</Header>
                <LoginCard />
              </Segment>
              <Segment secondary>
                <p>
                  New to Kids First Data Tracker?
                  &nbsp;
                  <Responsive as="br" maxWidth={Responsive.onlyLargeScreen.minWidth} />
                  <a href="mailto:support@kidsfirstdrc.org?Subject=DRC%20Data%20Tracker%20Access%20Request">
                    Join now <Icon name="chevron right" />
                  </a>
                </p>
              </Segment>
            </Segment.Group>
          </Grid.Column>

        </Grid.Row>
      </Grid>
    </section >
  );
}

export default LoginView;
