import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {GET_STUDY_BY_ID, ALL_EVENTS, MY_PROFILE} from '../state/queries';
import {
  Container,
  Segment,
  Message,
  Placeholder,
  Header,
  Icon,
  Select,
  Button,
} from 'semantic-ui-react';
import EmptyView from './EmptyView';
import NotFoundView from './NotFoundView';
import EventList from '../components/EventList/EventList';
import {eventType} from '../common/enums';

const LogsView = ({match}) => {
  const {loading, data, error, refetch, fetchMore} = useQuery(ALL_EVENTS, {
    variables: {
      studyId: match.params.kfId,
      orderBy: '-created_at',
      first: 20,
    },
    pollInterval: 30000,
  });

  const loadMore = () =>
    fetchMore({
      variables: {
        studyId: match.params.kfId,
        orderBy: '-created_at',
        first: 20,
        cursor: data.allEvents.pageInfo.endCursor,
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

  const {loading: studyLoading, data: studyData} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      kfId: match.params.kfId,
    },
    fetchPolicy: 'network-only',
  });
  const studyByKfId = studyData && studyData.studyByKfId;
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

  if (loading || studyLoading)
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
        <Helmet>
          <title>
            {`KF Data Tracker - Study logs - Error ${
              studyByKfId ? 'for ' + studyByKfId.kfId : null
            }`}
          </title>
        </Helmet>
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
  if (studyByKfId === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the study with ID ${match.params.kfId}`}
      />
    );
  }
  if (isAdmin) {
    return (
      <Container as={Segment} basic vertical>
        <Helmet>
          <title>{`KF Data Tracker - Study logs ${
            studyByKfId ? 'for ' + studyByKfId.name : null
          }`}</title>
        </Helmet>
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
        {allEvents && allEvents.pageInfo.hasNextPage && (
          <Button attached="bottom" onClick={loadMore}>
            More
          </Button>
        )}
      </Container>
    );
  } else {
    return (
      <>
        <Helmet>
          <title>KF Data Tracker - Study logs for {studyByKfId.name}</title>
        </Helmet>
        <EmptyView />
      </>
    );
  }
};

export default LogsView;
