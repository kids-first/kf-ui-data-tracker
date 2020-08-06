import React from 'react';
import PropTypes from 'prop-types';
import {Formik} from 'formik';
import {Message, Form, List} from 'semantic-ui-react';
import defaultAvatar from '../assets/defaultAvatar.png';
import {collaboratorRoles} from '../common/enums';

const AddCollaboratorForm = ({formikProps, availableUsers, disabled}) => {
  const {
    errors,
    touched,
    handleBlur,
    setFieldTouched,
    setFieldValue,
    status,
  } = formikProps;
  const options =
    availableUsers && availableUsers.length > 0
      ? availableUsers
          .sort(({node: u1}, {node: u2}) =>
            u1.username.localeCompare(u2.username, 'en-US', {
              caseFirst: 'upper',
              sensitivity: 'case',
              usage: 'sort',
            }),
          )
          .map(({node}) => ({
            key: node.id,
            value: node.id,
            text: `${node.displayName} - ${node.email}`,
            image: {avatar: true, src: node.picture || defaultAvatar},
          }))
      : [];

  const roleOptions = Object.values(collaboratorRoles).map(role => ({
    key: role.key,
    value: role.key,
    text: role.name,
  }));

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
      <p>Select a role and a registered user to add as a collaborator.</p>
      <Form.Group>
        <Form.Dropdown
          selection
          search
          id="userId"
          name="userId"
          className="expand"
          autoComplete="off"
          disabled={options.length === 0 || disabled}
          onBlur={() => handleBlur('userId')}
          options={options}
          placeholder={
            options.length === 0 ? 'There are no users to add' : 'Choose a user'
          }
          onChange={(e, {name, value}) => {
            setFieldTouched('userId');
            setFieldValue('userId', value);
          }}
          error={
            touched.userId !== undefined &&
            errors.userId !== undefined &&
            errors.userId.length > 0 &&
            !disabled
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Dropdown
          selection
          search
          id="role"
          name="role"
          className="expand"
          autoComplete="off"
          disabled={roleOptions.length === 0 || disabled}
          onBlur={() => handleBlur('role')}
          options={roleOptions}
          placeholder={'Choose role'}
          onChange={(e, {name, value}) => {
            setFieldTouched('role');
            setFieldValue('role', value);
          }}
          error={
            touched.userId !== undefined &&
            errors.userId !== undefined &&
            errors.userId.length > 0 &&
            !disabled
          }
        />
        <Form.Button
          primary
          type="submit"
          data-testid="add-button"
          loading={formikProps.isSubmitting}
          disabled={!formikProps.isValid || formikProps.isSubmitting}
          onClick={formikProps.handleSubmit}
        >
          Add Collaborator
        </Form.Button>
      </Form.Group>
      {status && !touched.userId && <Message {...status} />}
      {errors.length && (
        <Message negative title="Error" content={formatErrors(errors)} />
      )}
    </Form>
  );
};

AddCollaboratorForm.propTypes = {
  /** Array of all unlinked projects */
  availableUsers: PropTypes.array,
};

const AddForm = ({onSubmit, availableUsers}) => (
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
      <AddCollaboratorForm
        availableUsers={availableUsers || []}
        formikProps={formikProps}
      />
    )}
  </Formik>
);

export default AddForm;
