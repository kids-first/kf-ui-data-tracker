import React from 'react';
import {useQuery} from '@apollo/react-hooks';
import {Button, Divider, Icon, List, Message, Modal} from 'semantic-ui-react';
import {Formik} from 'formik';
import {ALL_STUDIES, ALL_GROUPS} from '../state/queries';
import {InviteForm} from '../forms';

/**
 * Modal to invite a user to the Data Tracker by email.
 * This is the controller that handles the form submission and state.
 */
const InviteModal = ({open, onCloseDialog}) => {
  const {data: studiesData} = useQuery(ALL_STUDIES);
  const {data: groupsData} = useQuery(ALL_GROUPS);
  const studies = studiesData && studiesData.allStudies.edges;
  const groups =
    groupsData && groupsData.allGroups && groupsData.allGroups.edges;

  const formatErrors = errors => {
    return (
      <List bulleted>
        {errors.map(msg => (
          <List.Item>{msg}</List.Item>
        ))}
      </List>
    );
  };

  const onSubmit = (values, {setErrors, setStatus, setSubmitting}) => {
    setSubmitting(true);
    setStatus({
      icon: 'warning',
      header: 'Error',
      content: formatErrors(['error']),
      negative: true,
    });
  };

  return (
    <Modal open={open} onClose={onCloseDialog} closeIcon size="small">
      <Formik
        initialValues={{
          studies: [],
          groups: [],
          email: null,
        }}
        validate={values => {
          let errors = {};
          if (!values.email) {
            errors.email = 'Required';
          }
          if (values.groups.length <= 0) {
            errors.groups = 'Required';
          }
          if (values.studies.length <= 0) {
            errors.studies = 'Required';
          }
          return errors;
        }}
        onSubmit={onSubmit}
      >
        {formikProps => (
          <InviteModalContent
            onCloseDialog={onCloseDialog}
            studies={studies || []}
            groups={groups || []}
            formikProps={formikProps}
          />
        )}
      </Formik>
    </Modal>
  );
};

/**
 * Modal content which renders the actual modal and form
 */
const InviteModalContent = ({onCloseDialog, studies, groups, formikProps}) => {
  const {isSubmitting, isValid, handleSubmit, status} = formikProps;

  return (
    <>
      <Modal.Header content="Invite Users to the Data Tracker" />
      <Modal.Content>
        <Modal.Description>
          <Message icon info>
            <Icon name="mail" />
            <Message.Content>
              <Message.Header>Invite a user by email</Message.Header>
              Send users an invitation email with a refferal code that will
              automatically add them to the appropriate studies after they log
              in for the first time.
            </Message.Content>
          </Message>
        </Modal.Description>
        <Divider />

        <InviteForm
          formikProps={formikProps}
          studies={studies}
          groups={groups}
        />
        {status && <Message {...status} />}
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => onCloseDialog()}>Cancel</Button>
        <Button
          icon
          primary
          type="submit"
          labelPosition="right"
          data-testid="invite-button"
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
        >
          Send Email Invite
          <Icon name="send" />
        </Button>
      </Modal.Actions>
    </>
  );
};

export default InviteModal;
