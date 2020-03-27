import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Button, Form, List, Message, Modal} from 'semantic-ui-react';
import {Formik} from 'formik';
import {ALL_USERS} from '../state/queries';
import {AddCollaboratorForm} from '../forms';

const AddCollaboratorModal = ({
  open,
  study,
  addCollaborator,
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
            {err.GraphQLErrors && err.graphQLErrors.map((err, i) => (
              <List.Item key={i}>{err.message}</List.Item>
            ))}
          </List>
        );

        setErrors(errors);
      });
  };

  return (
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
        <Modal
          open={open}
          onClose={() => {
            setErrors('');
            onCloseDialog();
          }}
          closeIcon
          size="tiny"
        >
          <Modal.Header content="Add a Collaborator" />
          <Modal.Content as={Form} onSubmit={formikProps.handleSubmit}>
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
            {errors && <Message negative title="Error" content={errors} />}
          </Modal.Content>
          <Modal.Actions as={Form} onSubmit={formikProps.handleSubmit}>
            <Button onClick={onCloseDialog}>Cancel</Button>
            <Button
              primary
              type="submit"
              data-testid="add-button"
              loading={formikProps.isSubmitting}
              disabled={!formikProps.isValid || formikProps.isSubmitting}
            >
              Add
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Formik>
  );
};

export default AddCollaboratorModal;
