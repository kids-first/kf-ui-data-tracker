import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';
import {withRouter, Link} from 'react-router-dom';
import {
  Button,
  Container,
  Dimmer,
  Header,
  Grid,
  Image,
  Icon,
  List,
  Message,
  Segment,
  Loader,
} from 'semantic-ui-react';
import {Progress} from '../components/Progress';
import {ReleaseTaskList} from '../components/ReleaseTaskList';
import {
  ReleaseHeader,
  MarkdownEditor,
  ReleaseActions,
  LogViewer,
} from '../components/ReleaseDetail';
import paragraph from '../../assets/paragraph.png';

import {GET_RELEASE, ALL_EVENTS} from '../queries';
import {MY_PROFILE} from '../../state/queries';
import {hasPermission} from '../../common/permissions';

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

  // Evaluate permissions
  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const allowEdit = myProfile && hasPermission(myProfile, 'change_release');

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
    <Grid container>
      <Helmet>
        <title>{`KF Data Tracker - Release`}</title>
      </Helmet>
      <Grid.Row>
        <Grid.Column mobile={16} className="mt-15">
          <Link to={`/releases/history`} data-testid="back-to-releases">
            <Button basic size="mini" labelPosition="left" floated="left">
              <Icon name="arrow left" />
              All Releases
            </Button>
          </Link>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row className="noVerticalPadding">
        <Grid.Column width={16}>
          <Progress release={release} />
        </Grid.Column>
      </Grid.Row>

      {release && (
        <Grid.Row reversed="tablet computer">
          <Grid.Column
            mobile={16}
            tablet={3}
            computer={2}
            className="noPadding"
          >
            <ReleaseActions
              release={release}
              user={user}
              history={history}
              match={match}
            />
          </Grid.Column>
          <Grid.Column mobile={16} tablet={13} computer={14}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <ReleaseHeader release={release} loading={releaseLoading} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <MarkdownEditor
                    releaseId={release.id ? release.id : ''}
                    description={release.description ? release.description : ''}
                    allowed={allowEdit}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Header color="grey">Studies in this Release</Header>
                  <List bulleted>
                    {release.studies.edges.map(({node}) => (
                      <List.Item key={node.kfId}>
                        <Link to={`/study/${node.kfId}/basic-info/info`}>
                          {node.kfId}
                        </Link>{' '}
                        - {node.name}
                      </List.Item>
                    ))}
                  </List>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Header color="grey">Release Task Status</Header>
                  <ReleaseTaskList
                    tasks={release.tasks.edges.map(({node}) => node)}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Header color="grey">Logs</Header>
                  <LogViewer logs={{release: release.jobLog, ...logs}} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

export default withRouter(ReleaseDetailView);
