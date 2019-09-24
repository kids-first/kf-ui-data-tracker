import React from 'react';
import PropTypes from 'prop-types';
import {projectOptions, workflowOptions} from '../common/enums';
import {Form} from 'semantic-ui-react';
/**
 * A form to edit an existing Cavatica project.
 */
const EditProjectForm = ({formikProps}) => (
  <Form onSubmit={formikProps.handleSubmit}>
    <Form.Field>
      <label>Project Type:</label>
      <Form.Select
        type="select"
        name="projectType"
        onChange={(e, {name, value}) => formikProps.setFieldValue(name, value)}
        onBlur={formikProps.handleBlur}
        value={formikProps.values.projectType}
        options={projectOptions}
        error={
          formikProps.touched.projectType !== undefined &&
          formikProps.errors.projectType !== undefined &&
          formikProps.errors.projectType.length > 0
        }
      />
    </Form.Field>
    <Form.Field>
      <label>Workflow Type:</label>
      <Form.Select
        type="select"
        name="workflowType"
        onChange={(e, {name, value}) => formikProps.setFieldValue(name, value)}
        onBlur={formikProps.handleBlur}
        value={formikProps.values.workflowType}
        options={workflowOptions}
        error={
          formikProps.touched.workflowType !== undefined &&
          formikProps.errors.workflowType !== undefined &&
          formikProps.errors.workflowType.length > 0
        }
      />
    </Form.Field>
  </Form>
);

EditProjectForm.propTypes = {
  /** Props passed by Formik render function */
  formikProps: PropTypes.object.isRequired,
};

export default EditProjectForm;
