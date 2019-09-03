import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import {
  Button,
  Container,
  Dimmer,
  Header,
  Icon,
  List,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';
import {CavaticaProjectList} from '../components/CavaticaProjectList';

import {GET_PROJECTS, MY_PROFILE} from '../state/queries';
import {SYNC_PROJECTS, UNLINK_PROJECT} from '../state/mutations';

const CavaticaProjectsView = ({
  projects: {allProjects, loading, error},
  syncProjects,
  unlinkProject,
  user,
}) => {
  const isAdmin = !user.loading
    ? user.myProfile.roles.includes('ADMIN')
    : false;
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState();
  const [syncErrors, setSyncErrors] = useState();
  const sync = () => {
    setSyncing(true);
    setSyncResult(null);
    setSyncErrors(null);
    syncProjects()
      .then(resp => {
        setSyncing(false);
        setSyncResult(resp.data.syncProjects);
      })
      .catch(err => {
        setSyncing(false);
        setSyncErrors(err.message);
      });
  };
  return (
    <Container as={Segment} basic>
      <Header as="h3">
        <Button primary floated="right" loading={syncing} onClick={sync}>
          Scan Cavatica
        </Button>
        Cavatica Projects
      </Header>
      {(syncing || syncResult || syncErrors) && (
        <Segment basic>
          {syncing && (
            <Message
              icon={<Icon name="sync" loading />}
              header="Scanning"
              content="This could take a moment..."
            />
          )}
          {syncResult && (
            <Message info>
              <Message.Header>Synced</Message.Header>
              <Message.Content>
                Projects should now be sycrhronized with Cavatica:
                <List>
                  <List.Item>
                    Updated: {syncResult.updated.edges.length} projects
                  </List.Item>
                  <List.Item>
                    Created: {syncResult.created.edges.length} projects
                  </List.Item>
                  <List.Item>
                    Deleted: {syncResult.deleted.edges.length} projects
                  </List.Item>
                </List>
              </Message.Content>
            </Message>
          )}
          {syncErrors && <Message negative content={syncErrors} />}
        </Segment>
      )}
      <Segment basic>
        Listed are the Cavatica projects for analysis and investigator delivery
        and the studies they are related to. Projects created manually in
        Cavatica need to be scanned by the api to make them available for
        linking to studies. This may be done using the <i>Scan Cavatica</i>{' '}
        button.
      </Segment>
      <Segment basic>
        {loading && (
          <Segment basic padded="very">
            <Dimmer active inverted>
              <Loader inverted>Loading projects...</Loader>
            </Dimmer>
          </Segment>
        )}
        {!loading && allProjects && (
          <CavaticaProjectList
            projects={allProjects.edges}
            unlinkProject={isAdmin ? unlinkProject : null}
          />
        )}
      </Segment>
    </Container>
  );
};

export default compose(
  graphql(MY_PROFILE, {name: 'user'}),
  graphql(GET_PROJECTS, {name: 'projects'}),
  graphql(SYNC_PROJECTS, {
    name: 'syncProjects',
    options: props => ({
      refetchQueries: [
        {
          query: GET_PROJECTS,
        },
      ],
    }),
  }),
  graphql(UNLINK_PROJECT, {
    name: 'unlinkProject',
    options: props => ({
      refetchQueries: [
        {
          query: GET_PROJECTS,
        },
      ],
    }),
  }),
)(CavaticaProjectsView);
