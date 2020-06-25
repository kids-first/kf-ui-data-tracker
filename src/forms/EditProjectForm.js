import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {projectOptions, workflowSelection} from '../common/enums';
import {Form, Segment, Popup, Icon} from 'semantic-ui-react';
/**
 * A form to edit an existing Cavatica project.
 */
const EditProjectForm = ({formikProps, excludeWorkflows, existProject}) => {
  const [type, setType] = useState('');
  const [method, setMethod] = useState('');
  const [sample, setSample] = useState('');

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
          <Form.Group widths="equal">
            <Form.Select
              data-testid="workflow-type"
              type="select"
              name="workflowType"
              onChange={(e, {value}) => {
                setType(value);
                setMethod('');
                setSample('');
              }}
              value={type}
              options={workflowSelection.map(i => ({
                key: i.key,
                value: i.value,
                text: i.text,
              }))}
              placeholder="Workflow Type"
            />
            <Form.Select
              disabled={!type}
              data-testid="workflow-method"
              type="select"
              name="workflowMethod"
              onChange={(e, {value}) => setMethod(value)}
              value={method}
              options={
                workflowSelection.filter(i => i.value === type) &&
                workflowSelection.filter(i => i.value === type)[0]
                  ? workflowSelection.filter(i => i.value === type)[0].method
                  : []
              }
              placeholder="Workflow Method"
            />
            <Form.Select
              disabled={!type || !method}
              data-testid="workflow-sample-type"
              type="select"
              name="workflowSampleType"
              onChange={(e, {value}) => setSample(value)}
              value={sample}
              options={
                workflowSelection.filter(i => i.value === type) &&
                workflowSelection.filter(i => i.value === type)[0]
                  ? workflowSelection.filter(i => i.value === type)[0]
                      .sampleType
                  : []
              }
              placeholder="Workflow Sample Type"
            />
          </Form.Group>
            }
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
