import React, {useState} from 'react';
import {LinkProjectForm} from '../forms';
import {Button, Form, Modal} from 'semantic-ui-react';
import {Formik} from 'formik';

const LinkProjectModal = ({linkProject, onCloseDialog, study, allProjects}) => {
  const [errors, setErrors] = useState('');

  const onSubmit = (values, {setSubmitting}) => {
    setSubmitting(true);
    linkProject({
      variables: {project: values.projectId, study: study.id},
    })
      .then(res => {
        setErrors('');
        setSubmitting(false);
        onCloseDialog();
      })
      .catch(err => {
        console.log(err.message);
        setSubmitting(false);
        setErrors(err.message);
      });
  };

  return (
    <Formik
      initialValues={{
        projectId: null,
      }}
      validate={values => {
        let errors = {};
        if (!values.projectId) {
          errors.projectId = 'Required';
        }
        return errors;
      }}
      onSubmit={onSubmit}
    >
      {formikProps => (
        <Modal
          as={Form}
          onSubmit={formikProps.handleSubmit}
          open={true}
          onClose={onCloseDialog}
          closeIcon
        >
          <Modal.Header content="Link an Existing Analysis Project" />
          <Modal.Content>
            <p>An existing Cavatica project will be linked to this study.</p>
            <LinkProjectForm
              formikProps={formikProps}
              allProjects={allProjects}
              apiErrors={errors}
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
              Link
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Formik>
  );
};

export default LinkProjectModal;
