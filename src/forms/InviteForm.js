import React from 'react';
import {Dropdown, Form} from 'semantic-ui-react';
import {StudySelector} from '../components/StudySelector';

/**
 * Displays a form to invite a user to the Data Tracker by email to one or more
 * studies.
 */
const InviteForm = ({formikProps, studies, groups}) => {
  const {errors, touched, handleBlur, setFieldValue} = formikProps;

  const groupOptions =
    groups &&
    groups.map(({node}) => ({
      key: node.name,
      text: node.name,
      value: node.id,
    }));

  return (
    <Form>
      <Form.Field>
        <label htmlFor="groups">Permission groups this user will be added to</label>
        <Dropdown
          fluid
          multiple
          selection
          clearable
          id="groups"
          name="groups"
          placeholder="Groups..."
          options={groupOptions}
          onBlur={handleBlur}
          onChange={(e, {name, value}) => {
            setFieldValue('groups', value);
          }}
          error={
            touched.groups !== undefined &&
            errors.groups !== undefined &&
            errors.groups.length > 0
          }
        />
      </Form.Field>
      {studies && (
        <Form.Field>
          <label htmlFor="studies">Studies the user will be a member of</label>
          <StudySelector
            fluid
            studies={studies}
            id="studies"
            name="studies"
            placeholder="Studies..."
            onBlur={handleBlur}
            onChange={(e, {name, value}) => {
              setFieldValue('studies', value);
            }}
            error={
              touched.studies !== undefined &&
              errors.studies !== undefined &&
              errors.studies.length > 0
            }
          />
        </Form.Field>
      )}
      <Form.Field>
        <label htmlFor="email">User's email address</label>
        <Form.Input
          id="email"
          name="email"
          className="expand"
          icon="mail"
          autoComplete="off"
          iconPosition="left"
          onBlur={handleBlur}
          placeholder="Collaborator's email"
          onChange={(e, {name, value}) => {
            setFieldValue('email', value);
          }}
          error={
            touched.email !== undefined &&
            errors.email !== undefined &&
            errors.email.length > 0
          }
        />
      </Form.Field>
    </Form>
  );
};

export default InviteForm;
