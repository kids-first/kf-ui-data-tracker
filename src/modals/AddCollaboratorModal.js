import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Button, Divider, List, Message, Modal} from 'semantic-ui-react';
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
  const [errors, setErrors] = useState('');
  const {data: usersData, error: usersError} = useQuery(ALL_USERS);

  const addedUsers = study.collaborators.edges.map(({node}) => node.id);
  const availableUsers =
    usersData &&
    usersData.allUsers.edges.filter(({node}) => !addedUsers.includes(node.id));

  const onSubmit = (values, {setSubmitting}) => {
    setSubmitting(true);
    addCollaborator({variables: {study: study.id, user: values.userId}})
      .then(resp => {
        setSubmitting(false);
        setErrors('');
        onCloseDialog();
      })
      .catch(err => {
        setSubmitting(false);
        const errors = (
          <List bulleted>
            {err.networkError &&
              err.networkError.result.errors.map((err, i) => (
                <List.Item key={i}>{err.message}</List.Item>
              ))}
            {err.graphQLErrors &&
              err.graphQLErrors.map((err, i) => (
                <List.Item key={i}>{err.message}</List.Item>
              ))}
          </List>
        );

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
    <Modal
      open={true}
      onClose={() => {
        setErrors('');
        onCloseDialog();
      }}
      closeIcon
      size="tiny"
    >
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
          onSubmit={onSubmit}
        >
          {formikProps => (
            <>
              <AddCollaboratorForm
                availableUsers={availableUsers || []}
                formikProps={formikProps}
              />
              <Button
                primary
                type="submit"
                data-testid="add-button"
                loading={formikProps.isSubmitting}
                disabled={!formikProps.isValid || formikProps.isSubmitting}
                onClick={formikProps.handleSubmit}
              >
                Add Collaborator
              </Button>
              {usersError && (
                <Message
                  negative
                  title="Problem loading users"
                  content={usersError}
                />
              )}
              {errors && <Message negative title="Error" content={errors} />}
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
