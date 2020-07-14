import React from 'react';
import {Formik} from 'formik';
import {Form, Icon, List, Message} from 'semantic-ui-react';

const InviteCollaboratorForm = ({formikProps, disabled}) => {
  const {errors, touched, handleBlur, setFieldValue, status} = formikProps;

  const formatErrors = errors => {
    return (
      <List bulleted>
        {errors.map(msg => (
          <List.Item>{msg}</List.Item>
        ))}
      </List>
    );
  };

  return (
    <Form>
      <p>
        Send an email to a user with an invitation to join this study as a
        collaborator. The collaborator's role may be set after they've signed
        up.
      </p>
      <Form.Group>
        <Form.Input
          id="email"
          name="email"
          className="expand"
          icon="mail"
          autoComplete="off"
          iconPosition="left"
          disabled={disabled}
          onBlur={handleBlur}
          placeholder="Collaborator's email"
          onChange={(e, {name, value}) => {
            setFieldValue('email', value);
          }}
          error={
            touched.email !== undefined &&
            errors.email !== undefined &&
            errors.email.length > 0 &&
            !disabled
          }
        />
        <Form.Button
          icon
          primary
          type="submit"
          labelPosition="right"
          data-testid="invite-button"
          loading={formikProps.isSubmitting}
          disabled={!formikProps.isValid || formikProps.isSubmitting}
          onClick={formikProps.handleSubmit}
        >
          Send Email Invite
          <Icon name="send" />
        </Form.Button>
      </Form.Group>
      {status && <Message {...status} />}
      {formikProps.errors.length && (
        <Message
          negative
          title="Error"
          content={formatErrors(formikProps.errors)}
        />
      )}
    </Form>
  );
};

const InviteForm = ({onSubmit}) => (
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
    onSubmit={onSubmit}
  >
    {formikProps => <InviteCollaboratorForm formikProps={formikProps} />}
  </Formik>
);

export default InviteForm;
