import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Button, Divider, Message, Modal} from 'semantic-ui-react';
import {Formik} from 'formik';
import {ALL_USERS} from '../state/queries';
import {AddCollaboratorForm, InviteCollaboratorForm} from '../forms';

const AddCollaboratorModal = ({
  open,
  study,
  addCollaborator,
  inviteCollaborator,
  onCloseDialog,
  users,
}) => {
  const {data: usersData, error: usersError} = useQuery(ALL_USERS);

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
      <Modal.Header content="Add Collaborators" />
      <Modal.Content>
        <Formik
          initialValues={{
            userId: null,
          }}
          validate={values => {
            let errors = {};
            if (!values.userId) {
              errors.userId = 'Required';
            }
            return errors;
          }}
          onSubmit={onSubmitAdd}
        >
          {formikProps => (
            <>
              <AddCollaboratorForm
                availableUsers={availableUsers || []}
                formikProps={formikProps}
              />
              {usersError && (
                <Message
                  negative
                  title="Problem loading users"
                  content={usersError}
                />
              )}
            </>
          )}
        </Formik>

        <Divider horizontal content="OR" />

        <Formik
          initialValues={{
            email: null,
          }}
          validate={values => {
            let errors = {};
            if (!values.email) {
              errors.email = 'Required';
            }
            return errors;
          }}
          onSubmit={onSubmitInvite}
        >
          {formikProps => (
            <InviteCollaboratorForm formikProps={formikProps} study={study} />
          )}
        </Formik>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onCloseDialog}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AddCollaboratorModal;
