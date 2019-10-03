import React from 'react';
import {graphql, compose} from 'react-apollo';
import {
  Container,
  Dimmer,
  Divider,
  Header,
  Loader,
  Select,
  Segment,
} from 'semantic-ui-react';
import {eventType} from '../common/enums';
import {EventList} from '../components/EventList';
import {ALL_EVENTS, ALL_STUDIES, ALL_USERS} from '../state/queries';
import {AnalyticsViewConsumer} from '../analyticsTracking';

const EventsView = ({
  allUsers: {allUsers, loading: loadingUsers},
  allStudies: {allStudies, loading: loadingStudies},
  allEvents: {allEvents, refetch, loading, error},
}) => {
  const studyOptions = allStudies
    ? allStudies.edges.map(({node}) => ({
        text: `${node.kfId} - ${node.name || node.shortName}`,
        value: node.kfId,
      }))
    : [];
  const userOptions = allUsers
    ? allUsers.edges.map(({node}) => ({
        text: node.username,
        value: node.username,
      }))
    : [];
  const eventTypeOptions = Object.keys(eventType).map(type => ({
    text: eventType[type].title,
    value: type,
  }));
  return (
    <AnalyticsViewConsumer mountProperties={{}}>
      <Container as={Segment} basic>
        <Header as="h3">Data Tracker Event Log</Header>
        <Segment basic>
          All actions taken in the data tracker are available here for auditing.
        </Segment>
        <Segment basic>
          <span className="smallLabel">Filter by:</span>
          <Select
            clearable
            placeholder="User"
            loading={loadingUsers}
            options={userOptions}
            onChange={(e, {name, value}) => refetch({username: value})}
          />
          <Select
            clearable
            placeholder="Study"
            loading={loadingUsers}
            options={studyOptions}
            onChange={(e, {name, value}) => refetch({studyId: value})}
          />
          <Select
            clearable
            placeholder="Event Type"
            options={eventTypeOptions}
            onChange={(e, {name, value}) => refetch({eventType: value})}
          />
          <Divider />
          {loading && (
            <Segment basic padded="very">
              <Dimmer active inverted>
                <Loader inverted>Loading events...</Loader>
              </Dimmer>
            </Segment>
          )}
          {!loading && allEvents && <EventList events={allEvents.edges} />}
        </Segment>
      </Container>
    </AnalyticsViewConsumer>
  );
};

export default compose(
  graphql(ALL_USERS, {
    name: 'allUsers',
  }),
  graphql(ALL_STUDIES, {
    name: 'allStudies',
  }),
  graphql(ALL_EVENTS, {
    name: 'allEvents',
    options: {variables: {orderBy: '-created_at'}},
  }),
)(EventsView);
