import React, {useState} from 'react';
import {GET_STUDY_BY_ID} from '../state/queries';
import {CREATE_PROJECT} from '../state/mutations';
import {graphql, compose} from 'react-apollo';
import {NewProjectForm} from '../forms';
import {Button, Form, Modal} from 'semantic-ui-react';
import {Formik} from 'formik';

const NewProjectModal = ({open, createProject, onCloseDialog, study}) => {
  const [apiErrors, setApiErrors] = useState('');
  const onSubmit = (values, {setSubmitting}) => {
    setSubmitting(true);
    createProject({
      variables: {study: study.id, workflowType: values.workflowType},
    })
      .then(res => {
        setApiErrors('');
        setSubmitting(false);
        onCloseDialog();
      })
      .catch(err => {
        setSubmitting(false);
        setApiErrors(err.message);
      });
  };

  return (
    <Formik
      initialValues={{
        workflowType: null,
      }}
      validate={values => {
        let errors = {};
        if (!values.workflowType) {
          errors.workflowType = 'Required';
        }
        return errors;
      }}
      onSubmit={onSubmit}
    >
      {formikProps => (
        <Modal
          as={Form}
          onSubmit={formikProps.handleSubmit}
          open={open}
          onClose={onCloseDialog}
          closeIcon
        >
          <Modal.Header content="Create a New Analysis Project" />
          <Modal.Content>
            <p>
              A new project will be created in Cavatica for this study,
              initialized with all bix users, and setup for the workflow of your
              choosing.
            </p>
            <NewProjectForm
              formikProps={formikProps}
              apiErrors={apiErrors}
              excludeWorkflows={study.projects.edges.map(
                ({node}) => node.workflowType,
              )}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              size="mini"
              type="submit"
              disabled={Object.keys(formikProps.errors).length > 0}
              loading={formikProps.isSubmitting}
            >
              CREATE
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Formik>
  );
};

export default compose(
  graphql(CREATE_PROJECT, {
    name: 'createProject',
    options: props => ({
      refetchQueries: [
        {
          query: GET_STUDY_BY_ID,
          variables: {
            kfId: props.study.kfId,
          },
        },
      ],
    }),
  }),
)(NewProjectModal);
