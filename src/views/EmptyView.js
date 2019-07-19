import React from 'react';
import {Container, Segment, Header, Icon} from 'semantic-ui-react';
/**
 * Empty view as placeholder for upcomming views
 */
const EmptyView = props => (
  <Container as={Segment} basic padded="very">
    <Header as="h2" disabled textAlign="center">
      <Icon name="clock outline" />
      Coming Soon...
    </Header>
  </Container>
);

export default EmptyView;
