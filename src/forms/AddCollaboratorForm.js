import React from 'react';
import PropTypes from 'prop-types';
import {Form, Label, Dropdown} from 'semantic-ui-react';
import avatar from '../assets/avatarM.png';

const AddCollaboratorForm = ({formikProps, availableUsers, disabled}) => {
  const {errors, touched, handleBlur, setFieldValue} = formikProps;
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
            text: node.username,
            image: {avatar: true, src: node.picture || avatar},
          }))
      : [];

  return (
    <>
      <Form.Field>
        <label>Add a Collaborator:</label>
        <Dropdown
          selection
          search
          id="userId"
          name="userId"
          disabled={options.length === 0 || disabled}
          onBlur={handleBlur}
          options={options}
          placeholder={
            options.length === 0 ? 'There are no users to add' : 'Choose a user'
          }
          onChange={(e, {name, value}) => {
            setFieldValue('userId', value);
          }}
          error={
            touched.userId !== undefined &&
            errors.userId !== undefined &&
            errors.userId.length > 0 &&
            !disabled
          }
        />
        {touched.userId &&
          errors.userId &&
          errors.userId.length > 0 &&
          !disabled && (
            <Label pointing basic color="red">
              {errors.userId}
            </Label>
          )}
      </Form.Field>
    </>
  );
};

AddCollaboratorForm.propTypes = {
  /** Array of all unlinked projects */
  availableUsers: PropTypes.array,
};

export default AddCollaboratorForm;
