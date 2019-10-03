import React from 'react';
import {graphql, compose} from 'react-apollo';
import {ALL_EVENTS, MY_PROFILE} from '../state/queries';
import {
  Container,
  Segment,
  Message,
  Placeholder,
  Header,
  Icon,
  Select,
} from 'semantic-ui-react';
import EmptyView from './EmptyView';
import EventList from '../components/EventList/EventList';
import {eventType} from '../common/enums';
import {AnalyticsViewConsumer} from '../analyticsTracking';

const LogsView = ({events: {loading, allEvents, error, refetch}, user}) => {
  const isAdmin = !user.loading
    ? user.myProfile.roles.includes('ADMIN')
    : false;

  const eventTypeOptions = Object.keys(eventType).map(type => ({
    text: eventType[type].title,
    value: type,
  }));

  if (loading)
    return (
      <Container as={Segment} basic vertical>
        <Placeholder>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Container>
    );
  if (error || user.error)
    return (
      <Container as={Segment} basic>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {error && error.message && <p>Event Error: {error.message}</p>}
            {user.error && user.error.message && (
              <p>User Error: {user.error.message}</p>
            )}
          </Message.Content>
        </Message>
      </Container>
    );
  if (isAdmin) {
    return (
      <AnalyticsViewConsumer
        mountProperties={{
          events_length: allEvents.edges.map(({node}) => node).length,
        }}
      >
        <Container as={Segment} basic vertical>
          <Segment basic floated="right" className="noMargin noPadding">
            <Select
              clearable
              placeholder="Event Type"
              options={eventTypeOptions}
              onChange={(e, {name, value}) => refetch({eventType: value})}
            />
          </Segment>
          <Header as="h2" className="mt-6">
            Event Logs
          </Header>
          {allEvents.edges.length > 0 ? (
            <EventList events={allEvents.edges} />
          ) : (
            <Header disabled textAlign="center" as="h4">
              No event logs available or match your filter option.
            </Header>
          )}
        </Container>
      </AnalyticsViewConsumer>
    );
  } else {
    return <EmptyView />;
  }
};

export default compose(
  graphql(ALL_EVENTS, {
    name: 'events',
    options: props => ({
      variables: {
        studyId: props.match.params.kfId,
        orderBy: '-created_at',
      },
      pollInterval: 30000,
    }),
  }),
  graphql(MY_PROFILE, {name: 'user'}),
)(LogsView);
