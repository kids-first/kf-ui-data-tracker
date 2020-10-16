import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {withRouter} from 'react-router-dom';
import {
  Button,
  Container,
  Dimmer,
  Header,
  Image,
  Icon,
  Message,
  Segment,
  Loader,
} from 'semantic-ui-react';
import {Progress} from '../components/Progress';
import {TaskList} from '../components/TaskList';
import {Events} from '../components/Events';
import {
  ReleaseHeader,
  MarkdownEditor,
  ReleaseActions,
  ReleaseNotes,
} from '../components/ReleaseDetail';
import paragraph from '../../assets/paragraph.png';

import {GET_RELEASE, ALL_NOTES, ALL_EVENTS} from '../queries';

const ReleaseDetailView = ({user, history, match}) => {
  const relayId = Buffer.from('ReleaseNode:' + match.params.releaseId).toString(
    'base64',
  );

  const {
    loading: releaseLoading,
    error: releaseError,
    data: releaseData,
  } = useQuery(GET_RELEASE, {
    variables: {id: relayId},
    context: {clientName: 'coordinator'},
    pollInterval: 5000,
  });

  const {loading: eventsLoading, error: eventsError, data: events} = useQuery(
    ALL_EVENTS,
    {
      variables: {release: relayId},
      context: {clientName: 'coordinator'},
    },
  );

  const {loading: notesLoading, error: notesError, data: notes} = useQuery(
    ALL_NOTES,
    {
      variables: {release: relayId},
      context: {clientName: 'coordinator'},
    },
  );

  if (releaseError || eventsError || notesError)
    return (
      <Container as={Segment} basic>
        <Message
          negative
          header="Error"
          content={
            <>
              {releaseError && <p>Release Error: {releaseError.message}</p>}
              {eventsError && <p>Events Error: {eventsError.message}</p>}
              {notesError && <p>Notes Error: {notesError.message}</p>}
            </>
          }
        />
      </Container>
    );

  if (
    !releaseData ||
    releaseLoading ||
    !notes ||
    notesLoading ||
    !events ||
    eventsLoading
  )
    return (
      <Container as={Segment} basic>
        <Dimmer active inverted>
          <Loader active inverted>
            Loading Release
          </Loader>
        </Dimmer>
        <Image src={paragraph} alt="loading" />
      </Container>
    );

  let style = {
    marginTop: '24px',
    marginBottom: '24px',
  };

  const {release} = releaseData;

  if (!release) {
    return (
      <Container as={Segment} placeholder basic>
        <Header icon>
          <Icon name="warning sign" />
          Release Not Found
        </Header>
        <Segment.Inline>
          <Button primary onClick={() => history.push('/releases')}>
            Back to Releases
          </Button>
        </Segment.Inline>
      </Container>
    );
  }

  if (release.state === 'published') {
    style.backgroundColor = '#efffe8';
    style.padding = 20;
    style.marginTop = '4px';
    style.marginBottom = '4px';
  }

  if (release.state === 'canceled' || release.state === 'failed') {
    style.backgroundColor = '#f8a4a833';
    style.padding = 20;
    style.marginTop = '4px';
    style.marginBottom = '4px';
  }

  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>{`KF Data Tracker - Release Detail`}</title>
      </Helmet>
      <ReleaseHeader release={release} loading={releaseLoading} />
      <Segment vertical>
        <Progress release={release} />
      </Segment>

      {release && (
        <>
          <Segment vertical textAlign="center">
            <ReleaseActions
              release={release}
              user={user}
              history={history}
              match={match}
            />
          </Segment>

          <Segment vertical>
            <Header>Release Description</Header>
            <MarkdownEditor
              releaseId={release.id ? release.id : ''}
              description={release.description ? release.description : ''}
            />
          </Segment>

          <Segment vertical>
            <Header>Studies in this Release</Header>
            <ReleaseNotes release={release} />
          </Segment>

          <Segment vertical>
            <Header>Task Status</Header>
            <TaskList releaseId={release.kfId} />
          </Segment>

          <Segment vertical>
            <Header>Event History</Header>
            <Events events={events && events.allEvents.edges} />
          </Segment>
        </>
      )}
    </Container>
  );
};

export default withRouter(ReleaseDetailView);
