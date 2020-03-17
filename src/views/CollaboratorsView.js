import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {MY_PROFILE, GET_STUDY_BY_ID} from '../state/queries';
import {ADD_COLLABORATOR, REMOVE_COLLABORATOR} from '../state/mutations';
import {
  Container,
  Divider,
  Segment,
  Message,
  Placeholder,
  Header,
  Button,
  Icon,
} from 'semantic-ui-react';
import {AddCollaboratorModal} from '../modals';
import {CollaboratorsList} from '../components/CollaboratorsList';
import NotFoundView from './NotFoundView';

const CollaboratorsView = ({match, history}) => {
  const {loading, data, error} = useQuery(GET_STUDY_BY_ID, {
    variables: {
      kfId: match.params.kfId,
    },
    fetchPolicy: 'network-only',
  });
  const studyByKfId = data && data.studyByKfId;
  const {loading: userLoading, data: userData, error: userError} = useQuery(
    MY_PROFILE,
  );
  const [collaboratorModal, setCollaboratorModal] = useState(false);

  const [addCollaborator] = useMutation(ADD_COLLABORATOR, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          kfId: match.params.kfId,
        },
      },
    ],
  });
  const [removeCollaborator] = useMutation(REMOVE_COLLABORATOR, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          kfId: match.params.kfId,
        },
      },
    ],
  });

  const isAdmin =
    !userLoading && userData.myProfile
      ? userData.myProfile.roles.includes('ADMIN')
      : false;
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
  if (error || userError)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>
            {`KF Data Tracker - Study collaborators - Error ${
              studyByKfId ? 'for ' + studyByKfId.kfId : null
            }`}
          </title>
        </Helmet>
        <Message negative icon>
          <Icon name="warning circle" />
          <Message.Content>
            <Message.Header>Error</Message.Header>
            {error && error.message && <p>Study Error: {error.message}</p>}
            {userError && userError.message && (
              <p>User Error: {userError.message}</p>
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
  return (
    <Container as={Segment} basic vertical>
      <Helmet>
        <title>KF Data Tracker - Study collaborators</title>
      </Helmet>
      {isAdmin && (
        <Button
          primary
          icon="add"
          floated="right"
          labelPosition="left"
          content="ADD COLLABORATOR"
          onClick={() => setCollaboratorModal(!collaboratorModal)}
        />
      )}
      <Header as="h2" className="noMargin">
        Collaborators
      </Header>
      <Divider />

      {studyByKfId.collaborators.edges.length === 0 ? (
        <Container as={Segment} basic placeholder>
          <Header as="h2" icon>
            <Icon name="user outline" />
            No Collaborators Yet
          </Header>
        </Container>
      ) : (
        <Container>
          <CollaboratorsList
            users={studyByKfId.collaborators.edges}
            showAdminActions={isAdmin}
            removeCollaborator={({variables}) =>
              removeCollaborator({
                variables: {study: studyByKfId.id, ...variables},
              })
            }
          />
        </Container>
      )}

      <AddCollaboratorModal
        study={studyByKfId}
        open={collaboratorModal}
        addCollaborator={addCollaborator}
        users={studyByKfId.collaborators.edges}
        onCloseDialog={() => setCollaboratorModal(false)}
      />
    </Container>
  );
};

export default CollaboratorsView;
