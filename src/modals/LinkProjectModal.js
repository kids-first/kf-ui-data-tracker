import React, {useState} from 'react';
import {LinkProjectForm} from '../forms';
import {Button, Form, Message, Modal, Header, Icon} from 'semantic-ui-react';
import {Formik} from 'formik';

const LinkProjectModal = ({
  open,
  linkProject,
  onCloseDialog,
  study,
  allProjects,
  syncProjects,
}) => {
  const [errors, setErrors] = useState('');
  const [visible, setVisible] = useState(true);

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

  const [syncing, setSyncing] = useState(false);
  const [syncErrors, setSyncErrors] = useState();
  const sync = () => {
    setSyncing(true);
    setSyncErrors(null);
    syncProjects()
      .then(resp => {
        setSyncing(false);
      })
      .catch(err => {
        setSyncing(false);
        setSyncErrors(err.message);
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
        <Modal open={open} onClose={onCloseDialog} closeIcon>
          <Modal.Header content="Link an Existing Analysis Project" />
          <Modal.Content className="pb-0">
            <Button
              basic
              primary
              type="button"
              size="mini"
              icon="sync"
              floated="right"
              loading={syncing}
              content="SYNC PROJECTS"
              onClick={sync}
            />
            <Header
              as="h3"
              className="noMargin pb-10"
              content={'Link a Cavatica Project to ' + study.name}
            />

            {syncing && (
              <Message
                icon={<Icon name="sync" loading />}
                header="Syncing Cavatica Projects"
                content="This could take a moment..."
              />
            )}
            {visible && !syncing && (
              <Message
                warning
                onDismiss={() => {
                  setVisible(false);
                }}
                icon="attention"
                header="Attention"
                content="Projects created recently from Cavatica may require a sync before being available for linking."
              />
            )}
            {syncErrors && (
              <Message
                negative
                icon="warning circle"
                header="Error"
                content={syncErrors}
              />
            )}
          </Modal.Content>
          <Modal.Content as={Form} onSubmit={formikProps.handleSubmit}>
            {!allProjects || allProjects.length === 0 ? (
              <Message
                info
                icon="info"
                header="No Projects Available"
                content="There are currently no projects available for linking. All projects may already be linked, or they need to be sychronized with Cavatica by an administrator."
              />
            ) : (
              <LinkProjectForm
                formikProps={formikProps}
                allProjects={allProjects}
                apiErrors={errors}
                disabled={syncing}
              />
            )}
          </Modal.Content>
          <Modal.Actions as={Form} onSubmit={formikProps.handleSubmit}>
            <Button
              primary
              size="mini"
              type="submit"
              disabled={
                Object.keys(formikProps.errors).length > 0 ||
                (!allProjects || allProjects.length === 0)
              }
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
