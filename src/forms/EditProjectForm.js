import React from 'react';
import PropTypes from 'prop-types';
import {projectOptions, workflowOptions} from '../common/enums';
import {Form} from 'semantic-ui-react';
/**
 * A form to edit an existing Cavatica project.
 */
const EditProjectForm = ({formikProps, excludeWorkflows, existProject}) => {
  return (
    <Form onSubmit={formikProps.handleSubmit}>
      <Form.Field required>
        <label>Project Type:</label>
        <Form.Select
          type="select"
          name="projectType"
          onChange={(e, {name, value}) =>
            formikProps.setFieldValue(name, value)
          }
          onBlur={(e, {name, value}) => formikProps.handleBlur(name)(value)}
          value={formikProps.values.projectType}
          options={projectOptions}
          placeholder="Select a project type"
          error={
            formikProps.touched.projectType !== undefined &&
            formikProps.errors.projectType !== undefined &&
            formikProps.errors.projectType.length > 0
          }
        />
      </Form.Field>
      {formikProps.values.projectType === 'HAR' && (
        <Form.Field required className="noMargin">
          <label>Workflow Type:</label>
          <Form.Select
            className="noMargin"
            data-testid="workflow-input"
            type="select"
            name="workflowType"
            onChange={(e, {name, value}) =>
              formikProps.setFieldValue(name, value)
            }
            onBlur={(e, {name, value}) => formikProps.handleBlur(name)(value)}
            value={formikProps.values.workflowType}
            options={workflowOptions.filter(
              v => !excludeWorkflows.includes(v.value),
            )}
            placeholder="Select a workflow type"
            error={
              formikProps.touched.workflowType !== undefined &&
              formikProps.errors.workflowType !== undefined &&
              formikProps.errors.workflowType.length > 0
            }
          />
        </Form.Field>
      )}
      {formikProps.values.projectType === 'RES' && !existProject && (
        <Form.Field required className="noMargin">
          <label>Project Name:</label>
          <Form.Input
            fluid
            data-testid="workflow-input"
            name="workflowType"
            placeholder="Type in project name"
            onChange={(e, {name, value}) =>
              formikProps.setFieldValue(name, value)
            }
            onBlur={e => {
              formikProps.handleBlur(e);
            }}
            value={formikProps.values.workflowType}
            error={
              formikProps.touched.workflowType !== undefined &&
              formikProps.errors.workflowType !== undefined &&
              formikProps.errors.workflowType.length > 0
            }
          />
        </Form.Field>
      )}
      {formikProps.touched.workflowType !== undefined &&
        formikProps.errors.workflowType !== undefined &&
        formikProps.errors.workflowType.length > 0 && (
          <small className="noMargin text-red">
            {formikProps.errors.workflowType}
          </small>
        )}
    </Form>
  );
};

EditProjectForm.propTypes = {
  /** Props passed by Formik render function */
  formikProps: PropTypes.object.isRequired,
  /** Workflows to exclude from the select field */
  excludeWorkflows: PropTypes.array,
  /** Existing projects (filled on editing case) */
  existProject: PropTypes.object,
};

export default EditProjectForm;
