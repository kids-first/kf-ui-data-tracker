import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import {GET_STUDY_BY_ID, MY_PROFILE, GET_PROJECTS} from '../state/queries';
import {SYNC_PROJECTS, LINK_PROJECT, UNLINK_PROJECT} from '../state/mutations';
import {
  Container,
  Segment,
  Message,
  Placeholder,
  Header,
  Button,
  Icon,
} from 'semantic-ui-react';
import EmptyView from './EmptyView';
import NewProjectModal from '../modals/NewProjectModal';
import LinkProjectModal from '../modals/LinkProjectModal';
import CavaticaProjectList from '../components/CavaticaProjectList/CavaticaProjectList';

const CavaticaBixView = ({
  study: {loading, studyByKfId, error},
  projects,
  user,
  syncProjects,
  linkProject,
  unlinkProject,
}) => {
  const isAdmin = !user.loading
    ? user.myProfile.roles.includes('ADMIN')
    : false;
  const [showModal, setShowModal] = useState('');
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
  if (error || projects.error || user.error)
    return (
      <Container as={Segment} basic>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {error && error.message && <p>Study Error: {error.message}</p>}
            {projects.error && projects.error.message && (
              <p>Project Error: {projects.error.message}</p>
            )}
            {user.error && user.error.message && (
              <p>User Error: {user.error.message}</p>
            )}
          </Message.Content>
        </Message>
      </Container>
    );
  if (isAdmin) {
    return (
      <Container as={Segment} basic vertical>
        <Button
          primary
          floated="right"
          size="mini"
          icon="linkify"
          content="LINK PROJECT"
          onClick={() => setShowModal('linkProject')}
        />
        <Button
          basic
          primary
          floated="right"
          size="mini"
          icon="add"
          content="NEW PROJECT"
          onClick={() => setShowModal('addProject')}
        />
        <Header as="h2" className="noMargin">
          Cavatica Projects
        </Header>
        {(studyByKfId.projects.edges.filter(
          obj => obj.node.projectType === 'HAR',
        ).length === 0 ||
          studyByKfId.projects.edges.filter(
            obj => obj.node.projectType === 'DEL',
          ).length === 0) && (
          <Message
            negative
            icon="warning circle"
            header={'Missing projects'}
            content="Each study should have at lease one delivery and one analysis Cavatica project. Please link or create projects for the study."
          />
        )}

        {studyByKfId.projects.edges.length > 0 ? (
          <CavaticaProjectList
            projects={studyByKfId.projects.edges}
            unlinkProject={unlinkProject}
            hideStudy
          />
        ) : (
          <Header disabled textAlign="center" as="h4">
            No linked Cavatica projects.
          </Header>
        )}

        {showModal === 'addProject' && (
          <NewProjectModal
            study={studyByKfId}
            onCloseDialog={() => setShowModal('')}
          />
        )}
        {showModal === 'linkProject' && (
          <LinkProjectModal
            study={studyByKfId}
            allProjects={projects.allProjects}
            linkProject={linkProject}
            syncProjects={syncProjects}
            onCloseDialog={() => setShowModal('')}
          />
        )}
      </Container>
    );
  } else {
    return <EmptyView />;
  }
};

export default compose(
  graphql(GET_STUDY_BY_ID, {
    name: 'study',
    options: props => ({
      variables: {
        kfId: props.match.params.kfId,
      },
      fetchPolicy: 'network-only',
    }),
  }),
  graphql(SYNC_PROJECTS, {
    name: 'syncProjects',
    options: props => ({
      refetchQueries: [
        {
          query: GET_PROJECTS,
          variables: {
            study: '',
            deleted: false,
          },
        },
      ],
    }),
  }),
  graphql(LINK_PROJECT, {
    name: 'linkProject',
    options: props => ({
      refetchQueries: [
        {
          query: GET_STUDY_BY_ID,
          variables: {
            kfId: props.match.params.kfId,
          },
        },
      ],
    }),
  }),
  graphql(UNLINK_PROJECT, {
    name: 'unlinkProject',
    options: props => ({
      refetchQueries: [
        {
          query: GET_STUDY_BY_ID,
          variables: {
            kfId: props.match.params.kfId,
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
    }),
  }),
  graphql(MY_PROFILE, {name: 'user'}),
  graphql(GET_PROJECTS, {
    name: 'projects',
    options: props => ({
      variables: {
        study: '',
        deleted: false,
      },
    }),
  }),
)(CavaticaBixView);
