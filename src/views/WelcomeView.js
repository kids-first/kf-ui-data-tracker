import React from 'react';
import {Container, Header, Image, Segment} from 'semantic-ui-react';
import welcome from '../assets/welcome.svg';

/**
 * Welcome message for users without ability to view studies
 */
const WelcomeView = () => {
  return (
    <Container as={Segment} basic vertical padded="very" text>
      <Header textAlign="center" as="h1">
        Welcome to the Data Tracker!
      </Header>
      <Image centered src={welcome} size="medium" />
      <Header textAlign="center">
        You haven't been added to any studies yet.
        <Header.Subheader>
          Please wait until an administrator adds you or get in touch at{' '}
          <a href="mailto:support@kidsfirstdrc.org">support@kidsfirstdrc.org</a>
        </Header.Subheader>
      </Header>
    </Container>
  );
};

export default WelcomeView;
