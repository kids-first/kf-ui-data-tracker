import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {
  Container,
  Dimmer,
  Divider,
  Header,
  Loader,
  Select,
  Segment,
  Message,
} from 'semantic-ui-react';
import {eventType} from '../common/enums';
import {EventList} from '../components/EventList';
import {ALL_EVENTS, ALL_STUDIES, ALL_USERS} from '../state/queries';

const EventsView = () => {
  const {loading, data: eventData, error, refetch} = useQuery(ALL_EVENTS, {
    variables: {orderBy: '-created_at'},
  });
  const allEvents = eventData && eventData.allEvents;
  const {loading: loadingStudies, data: studyData} = useQuery(ALL_STUDIES);
  const allStudies = studyData && studyData.allStudies;
  const {loading: loadingUsers, data: userData} = useQuery(ALL_USERS);
  const allUsers = userData && userData.allUsers;

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

  if (error)
    return (
      <Container as={Segment} basic>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
        />
      </Container>
    );
  return (
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
          loading={loadingStudies}
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
  );
};

export default EventsView;
