import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {withRouter, Link} from 'react-router-dom';
import {
  Button,
  Container,
  Dimmer,
  Header,
  Image,
  Icon,
  List,
  Message,
  Segment,
  Loader,
} from 'semantic-ui-react';
import {Progress} from '../components/Progress';
import {TaskList} from '../components/TaskList';
import {
  ReleaseHeader,
  MarkdownEditor,
  ReleaseActions,
  LogViewer,
} from '../components/ReleaseDetail';
import paragraph from '../../assets/paragraph.png';

import {GET_RELEASE, ALL_EVENTS} from '../queries';

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
    pollInterval: 5000,
  });

  const {loading: eventsLoading, error: eventsError, data: events} = useQuery(
    ALL_EVENTS,
    {
      variables: {release: relayId},
    },
  );

  const logs =
    releaseData &&
    releaseData.release.tasks.edges.reduce(
      (o, edge) => ({
        ...o,
        [edge.node.releaseService.name]: edge.node.jobLog,
      }),
      {},
    );

  if (releaseError || eventsError)
    return (
      <Container as={Segment} basic>
        <Message
          negative
          header="Error"
          content={
            <>
              {releaseError && <p>Release Error: {releaseError.message}</p>}
              {eventsError && <p>Events Error: {eventsError.message}</p>}
            </>
          }
        />
      </Container>
    );

  if (!releaseData || releaseLoading || !events || eventsLoading)
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
            <List bulleted>
              {release.studies.edges.map(({node}) => (
                <List.Item>
                  <Link to={`/study/${node.kfId}/basic-info/info`}>
                    {node.kfId}
                  </Link>{' '}
                  - {node.name}
                </List.Item>
              ))}
            </List>
          </Segment>

          <Segment vertical>
            <Header>Services in this Release</Header>
            <List bulleted>
              {release.tasks.edges.map(({node}) => (
                <List.Item>
                  <Link to={`/releases/services/${node.releaseService.kfId}`}>
                    {node.releaseService.kfId}
                  </Link>{' '}
                  - {node.releaseService.name}
                </List.Item>
              ))}
            </List>
          </Segment>
          <Segment vertical>
            <Header>Task Status</Header>
            <TaskList releaseId={release.kfId} />
          </Segment>

          <Segment vertical>
            <Header>Logs</Header>
            <LogViewer logs={{release: release.jobLog, ...logs}} />
          </Segment>
        </>
      )}
    </Container>
  );
};

export default withRouter(ReleaseDetailView);
