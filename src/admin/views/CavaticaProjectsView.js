import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {
  Accordion,
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
import StudyProjects from '../../components/CavaticaProjectList/StudyProjects';

import {GET_PROJECTS, MY_PROFILE} from '../../state/queries';
import {
  SYNC_PROJECTS,
  UNLINK_PROJECT,
  IMPORT_VOLUME_FILES,
} from '../../state/mutations';

const CavaticaProjectsView = () => {
  const {loading, error, data} = useQuery(GET_PROJECTS, {
    variables: {},
  });
  const allProjects = data && data.allProjects;
  const user = useQuery(MY_PROFILE);
  const [syncProjects] = useMutation(SYNC_PROJECTS, {
    refetchQueries: [
      {
        query: GET_PROJECTS,
      },
    ],
  });
  const [unlinkProject] = useMutation(UNLINK_PROJECT, {
    refetchQueries: [
      {
        query: GET_PROJECTS,
      },
    ],
  });

  const [importVolumeFiles] = useMutation(IMPORT_VOLUME_FILES);

  const profile = user && user.data && user.data.myProfile;
  const permissions =
    profile &&
    profile.groups &&
    profile.groups.edges &&
    profile.groups.edges
      .map(({node}) => node.permissions.edges.map(({node}) => node.codename))
      .reduce((prev, curr) => prev.concat(curr));

  const canUnlink = permissions && permissions.includes('unlink_project');
  const canImport = permissions && permissions.includes('import_volume');
  const canEdit = permissions && permissions.includes('change_project');

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

  // Group projects by study, store unlinked under the null key
  const byStudy =
    allProjects &&
    allProjects.edges.reduce((acc, cur, i) => {
      const study = cur.node.study ? cur.node.study.kfId : null;
      if (study in acc) {
        acc[study] = acc[study].concat(cur);
      } else {
        acc[study] = [cur];
      }
      return acc;
    }, {});

  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - Cavatica projects - Error</title>
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
        <title>KF Data Tracker - Cavatica projects</title>
      </Helmet>
      <Header as="h2">
        <Button primary floated="right" loading={syncing} onClick={sync}>
          Scan Cavatica
        </Button>
        Cavatica Projects by Study
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
          <Accordion>
            {Object.keys(byStudy)
              .sort((v1, v2) => {
                if (v1 === 'null') {
                  return -1;
                } else if (v2 === 'null') {
                  return 1;
                }
                return 0;
              })
              .map(study => (
                <StudyProjects
                  key={study.kfId}
                  study={byStudy[study][0].node.study}
                  projects={byStudy[study]}
                  unlinkProject={canUnlink ? unlinkProject : null}
                  importVolumeFiles={canImport ? importVolumeFiles : null}
                  editable={canEdit}
                />
              ))}
          </Accordion>
        )}
      </Segment>
    </Container>
  );
};

export default CavaticaProjectsView;
