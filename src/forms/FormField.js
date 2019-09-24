import React from 'react';
import PropTypes from 'prop-types';
import {Form, Label} from 'semantic-ui-react';
/**
 * The FormField will render a semantic form field that will show a
 * description below label and error message if given.
 */
const FormField = ({
  id,
  name,
  description,
  required,
  focused,
  value,
  errors,
  touched,
  type,
  placeholder,
  handleChange,
  handleBlur,
  handleFocus,
  children,
  readOnly,
  newStudy,
}) => (
  <Form.Field required={required}>
    <label className="noMargin">{name}:</label>
    {!readOnly && description && (
      <p className="noMargin">
        <small>{description}</small>
      </p>
    )}
    {children ? (
      children
    ) : (
      <Form.Input
        className={readOnly ? 'readOnlyField noMargin' : 'noMargin'}
        fluid
        readOnly={readOnly}
        type={type}
        name={id}
        placeholder={placeholder}
        open={focused}
        onChange={handleChange}
        onBlur={e => {
          handleFocus('');
          handleBlur(e);
        }}
        onFocus={e => handleFocus(id)}
        value={value}
        error={
          touched !== undefined && errors !== undefined && errors.length > 0
        }
      />
    )}
    {touched && errors && errors.length > 0 && (
      <Label pointing basic color="red">
        {errors}
      </Label>
    )}
  </Form.Field>
);

FormField.propTypes = {
  /** The field input element name */
  id: PropTypes.string.isRequired,
  /** The display name used to label the field */
  name: PropTypes.string.isRequired,
  /** The help text to display on focus */
  description: PropTypes.string.isRequired,
  /** Whether the field is required or not */
  required: PropTypes.bool,
  /** The placeholder text for the input field */
  placeholder: PropTypes.string,
  /** Whether the field is currently in focus or not */
  focused: PropTypes.bool,
  /** The current value of the field */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** An error message for the input */
  errors: PropTypes.string,
  /** Whether the field has been focused yet */
  touched: PropTypes.bool,
  /** The type of html input to use */
  type: PropTypes.string,
  /** Function to call when the input is changed */
  handleChange: PropTypes.func,
  /** Function to call when the input loses focus */
  handleBlur: PropTypes.func,
  /** Function to call when the input recieves focus */
  handleFocus: PropTypes.func,
  /** Children element for optional for special input type */
  children: PropTypes.element,
};

export default FormField;
