import React, {useState} from 'react';
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
import NotFoundView from './NotFoundView';
import EventList from '../components/EventList/EventList';
import {eventType} from '../common/enums';
import {hasPermission} from '../common/permissions';

const LogsView = ({match}) => {
  const [filter, setFilter] = useState(null);
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
      id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
    },
    fetchPolicy: 'network-only',
  });
  const study = studyData && studyData.study;
  const studyName = study ? 'for ' + study.name : '';
  const allEvents = data && data.allEvents;
  const {data: profileData, error: userError} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const allowView =
    myProfile &&
    (hasPermission(myProfile, 'view_my_event') ||
      hasPermission(myProfile, 'view_event'));
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
  if ((error || userError) && allowView)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study logs - Error ${match.params.kfId}`}
          </title>
        </Helmet>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {error && error.message && <p>Event Error: {error.message}</p>}
            {userError && userError.message && (
              <p>User Error: {userError.message}</p>
            )}
          </Message.Content>
        </Message>
      </Container>
    );
  if (study === null) {
    return (
      <NotFoundView
        title="Study not found"
        message={`Cannot find the study with ID ${match.params.kfId}`}
      />
    );
  }
  if (allowView) {
    return (
      <Container as={Segment} basic vertical>
        <Helmet>
          <title>{`KF Data Tracker - Study logs ${studyName}`}</title>
        </Helmet>
        <Segment basic floated="right" className="noMargin noPadding">
          <Select
            selection
            clearable
            placeholder="Event Type"
            options={eventTypeOptions}
            value={filter}
            onChange={(e, {name, value}) => {
              setFilter(value);
              refetch({eventType: value});
            }}
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
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - Study logs for {study.name}</title>
        </Helmet>
        <Message
          warning
          icon="warning circle"
          header="You don't have access to event logs."
          content="Event logs will show up here once the permission is added to your account."
        />
      </Container>
    );
  }
};

export default LogsView;
