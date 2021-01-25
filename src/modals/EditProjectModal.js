import React, {useState} from 'react';
import {useMutation} from '@apollo/client';
import TimeAgo from 'react-timeago';
import {Formik} from 'formik';
import {Button, Header, Message, Modal} from 'semantic-ui-react';
import {UPDATE_PROJECT, CREATE_PROJECT} from '../state/mutations';
import {GET_STUDY_BY_ID} from '../state/queries';
import {EditProjectForm} from '../forms';
import {longDate} from '../common/dateUtils';

/**
 * A modal that allows a user to update an existing project
 */

export const projectFormValidation = values => {
  let errors = {};
  if (!values.projectType) {
    errors.projectType = 'Required';
  }
  if (!values.workflowType && values.projectType !== 'DEL') {
    errors.workflowType = 'Required';
  }
  if (/[~`!@#$%^&*+=[\]\\';,./{}|\\":<>()?]/g.test(values.workflowType)) {
    errors.workflowType = 'No special characters allowed';
  }
  return errors;
};

export const projectFormSubmission = (
  values,
  study,
  projectNode,
  createProject,
  updateProject,
  setError,
  onCloseDialog,
) => {
  setError(null);
  let responses = {};

  if (study) {
    createProject({
      variables: {
        study: study.id,
        workflowType: values.workflowType,
        projectType: values.projectType,
      },
    })
      .then(res => {
        responses.createProject = res;
        onCloseDialog();
      })
      .catch(err => {
        responses.createProject = err;
        const errorMessage = err.message
          ? err.message
          : 'Problem creating the project';
        setError(errorMessage);
      });
  }

  if (projectNode) {
    updateProject({variables: {id: projectNode.id, input: values}})
      .then(res => {
        responses.updateProject = res;
        onCloseDialog();
      })
      .catch(err => {
        responses.updateProject = err;
        const errorMessage = err.message
          ? err.message
          : 'Problem updating the project';
        setError(errorMessage);
      });
  }
  return responses;
};

const EditProjectModal = ({study, projectNode, onCloseDialog, open}) => {
  const [updateProject] = useMutation(UPDATE_PROJECT);
  const [createProject] = useMutation(CREATE_PROJECT, {
    refetchQueries: [
      {
        query: GET_STUDY_BY_ID,
        variables: {
          kfId: study ? study.kfId : '',
        },
      },
    ],
  });

  const [error, setError] = useState(null);

  return (
    <Modal open={open} onClose={onCloseDialog} size="small" closeIcon>
      <Formik
        initialValues={{
          workflowType: projectNode ? projectNode.workflowType : '',
          projectType: projectNode ? projectNode.projectType : '',
        }}
        validate={values => projectFormValidation(values)}
        onSubmit={values =>
          projectFormSubmission(
            values,
            study,
            projectNode,
            createProject,
            updateProject,
            setError,
            onCloseDialog,
          )
        }
      >
        {formikProps => (
          <>
            <Modal.Header
              content={
                projectNode ? 'Edit Cavatica Project' : 'Create a New Project'
              }
            />
            <Modal.Content>
              {projectNode ? (
                <Header size="medium">
                  {projectNode.name}
                  <Header.Subheader>
                    Created
                    {projectNode.createdBy
                      ? ' by ' + projectNode.createdBy + ' '
                      : ' '}
                    <TimeAgo
                      live={false}
                      date={projectNode.createdOn}
                      title={longDate(projectNode.createdOn)}
                    />
                    <br />
                    {projectNode.projectId}
                  </Header.Subheader>
                </Header>
              ) : (
                <p>
                  A new project will be created in Cavatica for this study,
                  initialized with all bix users, and setup for the workflow and
                  project type of your choosing.
                </p>
              )}

              <EditProjectForm
                formikProps={formikProps}
                excludeWorkflows={
                  study
                    ? study.projects.edges.map(({node}) => node.workflowType)
                    : []
                }
                existProject={projectNode}
                studyId={study.kfId}
              />
            </Modal.Content>
            <Modal.Actions>
              {error && (
                <Message negative className="text-left" content={error} />
              )}
              <Button
                primary
                disabled={
                  Object.values(formikProps.errors).length > 0 ||
                  formikProps.values.projectType.length === 0
                }
                size="mini"
                type="submit"
                onClick={formikProps.handleSubmit}
              >
                {projectNode ? 'SAVE' : 'CREATE'}
              </Button>
            </Modal.Actions>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default EditProjectModal;
