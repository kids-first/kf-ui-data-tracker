import React, {useState} from 'react';
import {graphql} from 'react-apollo';
import TimeAgo from 'react-timeago';
import {Formik} from 'formik';
import {Button, Header, Message, Modal} from 'semantic-ui-react';
import {UPDATE_PROJECT} from '../state/mutations';
import {EditProjectForm} from '../forms';
import {longDate} from '../common/dateUtils';

/**
 * A modal that allows a user to update an existing project
 */
const EditProjectModal = ({projectNode, updateProject, onCloseDialog}) => {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = values => {
    setSubmitting(true);
    setError(null);

    updateProject({variables: {id: projectNode.id, input: values}})
      .then(() => {
        setSubmitting(false);
        onCloseDialog();
      })
      .catch(err => {
        setError('Problem updating the project');
        setSubmitting(false);
        console.log(err);
      });
  };

  return (
    <Modal open={true} onClose={onCloseDialog} size="small" closeIcon>
      <Formik
        initialValues={{
          workflowType: projectNode.workflowType,
          projectType: projectNode.projectType,
        }}
        validate={values => {
          let errors = {};
          if (!values.workflowType) {
            errors.externalId = 'Required';
          }
          if (!values.projectType) {
            errors.name = 'Required';
          }
          return errors;
        }}
        onSubmit={(values, {setSubmitting}) => {
          onSubmit(values);
        }}
      >
        {formikProps => (
          <>
            <Modal.Header content="Edit Cavatica Project" />
            <Modal.Content>
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
              <EditProjectForm
                project={projectNode}
                formikProps={formikProps}
              />
            </Modal.Content>
            <Modal.Actions>
              {error && <Message negative content={error} />}
              <Button
                primary
                size="mini"
                loading={submitting}
                onClick={formikProps.handleSubmit}
              >
                SAVE
              </Button>
            </Modal.Actions>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default graphql(UPDATE_PROJECT, {name: 'updateProject'})(
  EditProjectModal,
);
