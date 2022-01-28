import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';
import {
  Container,
  Dimmer,
  Divider,
  Header,
  Loader,
  Select,
  Segment,
  Message,
  Button,
} from 'semantic-ui-react';
import {eventType} from '../../common/enums';
import {ALL_REFERRAL_TOEKNS} from '../queries';
import {EventList} from '../../components/EventList';
import {ALL_EVENTS, ALL_STUDIES, ALL_USERS} from '../../state/queries';
import {stringSort} from '../../common/sortUtils';

const EventsView = () => {
  const {data: referralData} = useQuery(ALL_REFERRAL_TOEKNS);
  const {loading, data: eventData, error, refetch, fetchMore} = useQuery(
    ALL_EVENTS,
    {
      variables: {orderBy: '-created_at', first: 20},
    },
  );

  const referralTokenData =
    referralData && referralData.allReferralTokens
      ? referralData.allReferralTokens.edges
      : [];

  const loadMore = () =>
    fetchMore({
      variables: {
        orderBy: '-created_at',
        first: 20,
        cursor: eventData.allEvents.pageInfo.endCursor,
      },
      updateQuery: (previousResult, {fetchMoreResult}) => {
        const newEdges = fetchMoreResult.allEvents.edges;
        const pageInfo = fetchMoreResult.allEvents.pageInfo;
        return newEdges.length
          ? {
              allEvents: {
                __typename: previousResult.allEvents.__typename,
                edges: [...previousResult.allEvents.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
    });

  const allEvents = eventData && eventData.allEvents;
  const {loading: loadingStudies, data: studyData} = useQuery(ALL_STUDIES);
  const allStudies = studyData && studyData.allStudies;
  const {loading: loadingUsers, data: userData} = useQuery(ALL_USERS);
  const allUsers = userData && userData.allUsers;

  const studyOptions = allStudies
    ? allStudies.edges
        .map(({node}) => ({
          key: node.id,
          text: `${node.kfId} - ${node.name || node.shortName}`,
          value: node.kfId,
        }))
        .sort((o1, o2) => stringSort(o1.text, o2.text))
    : [];
  const userOptions = allUsers
    ? allUsers.edges
        .map(({node}) => ({
          key: node.id,
          text: node.displayName,
          value: node.username,
        }))
        .sort((o1, o2) => stringSort(o1.text, o2.text))
    : [];
  const eventTypeOptions = Object.keys(eventType)
    .map(type => ({
      text: eventType[type].title,
      value: type,
    }))
    .sort((o1, o2) => stringSort(o1.text, o2.text));

  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - Events - Error</title>
        </Helmet>
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
      <Helmet>
        <title>KF Data Tracker - Events</title>
      </Helmet>
      <Header as="h3">Data Tracker Event Log</Header>
      <Segment basic>
        All actions taken in the data tracker are available here for auditing.
      </Segment>
      <Segment basic>
        <span className="smallLabel">Filter by:</span>
        <Select
          className="ml-10"
          clearable
          placeholder="User"
          loading={loadingUsers}
          options={userOptions}
          onChange={(e, {name, value}) => refetch({username: value})}
        />
        <Select
          className="ml-10"
          clearable
          placeholder="Study"
          loading={loadingStudies}
          options={studyOptions}
          onChange={(e, {name, value}) => refetch({studyId: value})}
        />
        <Select
          className="ml-10 min-w-250"
          clearable
          placeholder="Event Type"
          options={eventTypeOptions}
          onChange={(e, {name, value}) =>
            refetch({eventType: value.length > 0 ? value : null})
          }
        />
        <Divider />
        {loading && (
          <Segment basic padded="very">
            <Dimmer active inverted>
              <Loader inverted>Loading events...</Loader>
            </Dimmer>
          </Segment>
        )}
        {!loading && allEvents && (
          <EventList
            events={allEvents.edges}
            referralTokenData={referralTokenData}
          />
        )}
        {allEvents && allEvents.pageInfo.hasNextPage && (
          <Button attached="bottom" onClick={loadMore}>
            More
          </Button>
        )}
      </Segment>
    </Container>
  );
};

export default EventsView;
