import React from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {GET_STUDY_BY_ID, MY_PROFILE, GET_PROJECTS} from '../state/queries';
import {
  SYNC_PROJECTS,
  LINK_PROJECT,
  UNLINK_PROJECT,
  IMPORT_VOLUME_FILES,
} from '../state/mutations';
import {
  Container,
  Segment,
  Message,
  Placeholder,
  Header,
  Button,
  Icon,
} from 'semantic-ui-react';
import NotFoundView from './NotFoundView';
import EditProjectModal from '../modals/EditProjectModal';
import LinkProjectModal from '../modals/LinkProjectModal';
import CavaticaProjectList from '../components/CavaticaProjectList/CavaticaProjectList';
import {hasPermission} from '../common/permissions';

const CavaticaBixView = ({match, history}) => {
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
    },
    fetchPolicy: 'network-only',
  });
  const study = data && data.study;
  const projects = useQuery(GET_PROJECTS, {
    variables: {
      study: '',
      deleted: false,
    },
  });
  const {data: profileData, error: userError} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;
  const allowView =
    myProfile &&
    (hasPermission(myProfile, 'view_project') ||
      hasPermission(myProfile, 'view_my_study_project'));
  const allowAdd = myProfile && hasPermission(myProfile, 'add_project');
  const allowLink = myProfile && hasPermission(myProfile, 'link_project');
  const allowUnlink = myProfile && hasPermission(myProfile, 'unlink_project');
  const allowImport = myProfile && hasPermission(myProfile, 'import_volume');
  const allowSync = myProfile && hasPermission(myProfile, 'sync_project');
  const allowEdit = myProfile && hasPermission(myProfile, 'change_project');

  const [linkProject] = useMutation(LINK_PROJECT, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
        },
      },
    ],
  });
  const [unlinkProject] = useMutation(UNLINK_PROJECT, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          id: Buffer.from('StudyNode:' + match.params.kfId).toString('base64'),
        },
      },
      {
        query: GET_PROJECTS,
        variables: {
          study: '',
          deleted: false,
        },
      },
    ],
  });
  const [syncProjects] = useMutation(SYNC_PROJECTS, {
    refetchQueries: [
      {
        query: GET_PROJECTS,
        variables: {
          study: '',
          deleted: false,
        },
      },
    ],
  });
  const [importVolumeFiles] = useMutation(IMPORT_VOLUME_FILES);

  const hashOpenHook = (history, modalName) => {
    const modalNameHash = modalName.replace(' ', '-').toLowerCase();
    return modalNameHash === history.location.hash;
  };
  if (loading)
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
  if ((error || projects.error || userError) && allowView)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study projects - Error ${
              study ? 'for ' + study.kfId : null
            }`}
          </title>
        </Helmet>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {error && error.message && <p>Study Error: {error.message}</p>}
            {projects.error && projects.error.message && (
              <p>Project Error: {projects.error.message}</p>
            )}
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
          <title>{`KF Data Tracker - Study projects - Error ${
            study ? 'for ' + study.name : null
          }`}</title>
        </Helmet>
        {allowLink && (
          <Button
            primary
            floated="right"
            size="mini"
            icon="linkify"
            content="LINK PROJECT"
            onClick={() =>
              history.push(
                '/study/' +
                  history.location.pathname.split('/')[2] +
                  '/cavatica#link-cavatica-project',
              )
            }
          />
        )}
        {allowAdd && (
          <Button
            basic
            primary
            floated="right"
            size="mini"
            icon="add"
            content="NEW PROJECT"
            onClick={() =>
              history.push(
                '/study/' +
                  history.location.pathname.split('/')[2] +
                  '/cavatica#add-cavatica-project',
              )
            }
          />
        )}
        <Header as="h2" className="noMargin">
          Cavatica Projects
        </Header>
        {study.projects.edges.length > 0 ? (
          <CavaticaProjectList
            projects={study.projects.edges}
            unlinkProject={allowUnlink ? unlinkProject : null}
            importVolumeFiles={allowImport ? importVolumeFiles : null}
            editable={allowEdit}
          />
        ) : (
          <Message
            warning
            icon="warning circle"
            header="No linked Cavatica projects."
            content="Your projects will show up here once added to your study."
          />
        )}
        <EditProjectModal
          open={hashOpenHook(history, '#add-cavatica-project') && allowAdd}
          study={study}
          onCloseDialog={() =>
            history.push(
              '/study/' + history.location.pathname.split('/')[2] + '/cavatica',
            )
          }
        />
        <LinkProjectModal
          open={hashOpenHook(history, '#link-cavatica-project') && allowLink}
          study={study}
          allProjects={projects.data && projects.data.allProjects}
          linkProject={linkProject}
          syncProjects={allowSync ? syncProjects : null}
          onCloseDialog={() =>
            history.push(
              '/study/' + history.location.pathname.split('/')[2] + '/cavatica',
            )
          }
        />
      </Container>
    );
  } else {
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - Study projects for {study.name}</title>
        </Helmet>
        <Message
          warning
          icon="warning circle"
          header="You don't have access to any projects yet."
          content="Your projects will show up here once added to your account."
        />
      </Container>
    );
  }
};

export default CavaticaBixView;
