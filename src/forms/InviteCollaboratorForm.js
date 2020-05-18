import React from 'react';
import {Form, Icon, List, Message} from 'semantic-ui-react';

const InviteCollaboratorForm = ({formikProps, study, disabled}) => {
  const {errors, touched, handleBlur, setFieldValue} = formikProps;

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
        collaborator.
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

export default InviteCollaboratorForm;
