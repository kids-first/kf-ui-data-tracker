import React from 'react';
import PropTypes from 'prop-types';
import {Form, Label, Message} from 'semantic-ui-react';
import {workflowOptions} from '../common/enums';

const NewProjectForm = ({formikProps, apiErrors, excludeWorkflows}) => {
  const {errors, touched, handleBlur, setFieldValue} = formikProps;

  return (
    <>
      <Form.Field required>
        <label>Workflow Type:</label>
        <Form.Select
          type="select"
          name="workflowType"
          onChange={(e, {name, value}) => setFieldValue(name, value)}
          onBlur={handleBlur}
          placeholder="Select a workflow type"
          options={workflowOptions.filter(
            v => !excludeWorkflows.includes(v.value),
          )}
          error={
            touched.workflowType !== undefined &&
            errors.workflowType !== undefined &&
            errors.workflowType.length > 0
          }
        />
        {touched.workflowType &&
          errors.workflowType &&
          errors.workflowType.length > 0 && (
            <Label pointing basic color="red">
              {errors.workflowType}
            </Label>
          )}
      </Form.Field>
      {apiErrors && <Message negative content={apiErrors} />}
    </>
  );
};

NewProjectForm.propTypes = {
  /** Error message returned from server or API */
  apiErrors: PropTypes.string,
  /** Workflows to exclude from the select field */
  excludeWorkflows: PropTypes.array,
};

export default NewProjectForm;
