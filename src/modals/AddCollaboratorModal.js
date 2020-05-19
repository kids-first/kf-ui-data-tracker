import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Button, Divider, Modal} from 'semantic-ui-react';
import {ALL_USERS} from '../state/queries';
import {AddCollaboratorForm, InviteCollaboratorForm} from '../forms';

/**
 * Renders forms to add collaborators to studies.
 * If no addCollaborator function is passed, the add collaborator form with a
 * user drop down will not be rendered.
 * If no inviteCollaborator function is passed, the invite collaborator form
 * with a text box to invite users by email will not be rendered.
 */
const AddCollaboratorModal = ({
  open,
  study,
  addCollaborator,
  inviteCollaborator,
  onCloseDialog,
  users,
}) => {
  const {data: usersData} = useQuery(ALL_USERS);

  const addedUsers = study.collaborators.edges.map(({node}) => node.id);
  const availableUsers =
    usersData &&
    usersData.allUsers.edges.filter(({node}) => !addedUsers.includes(node.id));

  const onSubmitAdd = (
    values,
    {resetForm, setErrors, setStatus, setSubmitting},
  ) => {
    setSubmitting(true);
    addCollaborator({variables: {study: study.id, user: values.userId}})
      .then(resp => {
        setSubmitting(false);
        // Reset the state of the form so the user may add other collaborators
        resetForm();
        // Status keeps short hand props for the Message component
        setStatus({
          positive: true,
          header: 'User Added',
          content:
            'The user was successfully added to the study as a collaborator',
          icon: 'check circle',
          size: 'small',
        });
      })
      .catch(({networkError, graphQLErrors}) => {
        setSubmitting(false);
        const errors = [
          ...graphQLErrors.map(({message}) => message),
          networkError.message,
        ];
        setErrors(errors);
      });
  };

  const onSubmitInvite = (values, {setSubmitting, setErrors}) => {
    setSubmitting(true);
    inviteCollaborator({variables: {study: study.id, user: values.userId}})
      .then(resp => {
        setSubmitting(false);
      })
      .catch(({networkError, graphQLErrors}) => {
        setSubmitting(false);
        const errors = [
          ...graphQLErrors.map(({message}) => message),
          networkError.message,
        ];
        setErrors(errors);
      });
  };

  return (
    <Modal open={open} onClose={onCloseDialog} closeIcon size="tiny">
      <Modal.Header content="Add Collaborators to Study" />
      <Modal.Content>
        <Modal.Description>
          You are adding collaborators to the <b>{study && study.name}</b>{' '}
          study. Collaborators will be able to see this study and its resources
          once they are added.
        </Modal.Description>
        {addCollaborator && (
          <AddCollaboratorForm
            availableUsers={availableUsers}
            onSubmit={onSubmitAdd}
          />
        )}
        {addCollaborator && inviteCollaborator && (
          <Divider horizontal content="OR" />
        )}
        {inviteCollaborator && (
          <InviteCollaboratorForm onSubmit={onSubmitInvite} />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onCloseDialog}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AddCollaboratorModal;
