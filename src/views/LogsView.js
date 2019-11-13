import React from 'react';
import {useQuery} from '@apollo/react-hooks';
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

const LogsView = ({match}) => {
  const {loading, data, error, refetch} = useQuery(ALL_EVENTS, {
    variables: {
      studyId: match.params.kfId,
      orderBy: '-created_at',
    },
    pollInterval: 30000,
  });
  const allEvents = data && data.allEvents;
  const user = useQuery(MY_PROFILE);

  const isAdmin =
    !user.loading && user.data.myProfile
      ? user.data.myProfile.roles.includes('ADMIN')
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
    );
  } else {
    return <EmptyView />;
  }
};

export default LogsView;
