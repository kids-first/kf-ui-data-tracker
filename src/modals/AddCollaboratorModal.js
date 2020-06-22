import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';
import {Button, Divider, Modal} from 'semantic-ui-react';
import {ALL_USERS, ALL_GROUPS} from '../state/queries';
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

  // Needed to extract the group id of the Investigators group
  const {data: groupsData} = useQuery(ALL_GROUPS);
  const groups =
    groupsData && groupsData.allGroups && groupsData.allGroups.edges;
  const defaultGroup =
    groups && groups.filter(({node}) => node.name === 'Investigators')[0].node;

  const onSubmitAdd = (
    values,
    {resetForm, setErrors, setStatus, setSubmitting},
  ) => {
    setSubmitting(true);
    addCollaborator({
      variables: {study: study.id, user: values.userId, role: 'RESEARCHER'},
    })
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
        const errors = [...graphQLErrors.map(({message}) => message)];
        setErrors(errors);
      });
  };

  const onSubmitInvite = (values, {setSubmitting, setErrors, setStatus}) => {
    setSubmitting(true);
    inviteCollaborator({
      variables: {
        input: {
          email: values.email,
          studies: [study.id],
          groups: [defaultGroup.id],
        },
      },
    })
      .then(resp => {
        setStatus({
          icon: 'mail',
          header: 'Invite Sent',
          content: (
            <>
              An email containing an invite link was sent to{' '}
              <b>{values.email}</b> and should arrive shortly.
            </>
          ),
          info: true,
        });
        setSubmitting(false);
      })
      .catch(({networkError, graphQLErrors}) => {
        setSubmitting(false);
        const errors = [
          ...graphQLErrors.map(({message}) => message),
          ...(networkError ? [networkError.message] : []),
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
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'add collaborator button']
                : ['add collaborator button'],
            })}
          >
            {({logEvent}) => (
              <AddCollaboratorForm
                availableUsers={availableUsers}
                onSubmit={(values, formikProps) => {
                  onSubmitAdd(values, formikProps);
                  logEvent('click');
                }}
              />
            )}
          </Amplitude>
        )}
        {addCollaborator && inviteCollaborator && (
          <Divider horizontal content="OR" />
        )}
        {inviteCollaborator && (
          <Amplitude
            eventProperties={inheritedProps => ({
              ...inheritedProps,
              scope: inheritedProps.scope
                ? [...inheritedProps.scope, 'invite button']
                : ['invite button'],
            })}
          >
            {({logEvent}) => (
              <InviteCollaboratorForm
                onSubmit={(values, formikProps) => {
                  onSubmitInvite(values, formikProps);
                  logEvent('click');
                }}
              />
            )}
          </Amplitude>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onCloseDialog}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};
const AnalyticsModal = props => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: inheritedProps.scope
        ? [...inheritedProps.scope, 'add collaborator modal']
        : ['add collaborator modal'],
    })}
  >
    {props.open && <LogOnMount eventType="modal opened" />}
    <AddCollaboratorModal {...props} />
  </Amplitude>
);

export default AnalyticsModal;
