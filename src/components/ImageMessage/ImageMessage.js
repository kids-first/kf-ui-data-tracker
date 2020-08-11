import React from 'react';
import {Header, Container, Image, Segment} from 'semantic-ui-react';

const ImageMessage = ({title, message, image}) => (
  <Container as={Segment} basic placeholder text>
    <Image centered src={image} size="medium" />
    <Header as="h1" textAlign="center">
      {title}
      <Header.Subheader>{message}</Header.Subheader>
    </Header>
  </Container>
);

export default ImageMessage;
