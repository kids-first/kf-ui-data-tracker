import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {projectOptions, workflowSelection} from '../common/enums';
import {Form, Segment, Popup, Icon} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
/**
 * A form to edit an existing Cavatica project.
 */
const EditProjectForm = ({
  formikProps,
  excludeWorkflows,
  existProject,
  studyId,
}) => {
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
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
          <p>A new cavatica project will be created with the following ID:</p>
          <Popup
            inverted
            disabled={!type || !method || !sample}
            position="right center"
            popperDependencies={[copied]}
            trigger={
              <CopyToClipboard
                text={
                  studyId.toLowerCase().replace('_', '-') +
                  '-' +
                  type +
                  (method && '-') +
                  method +
                  (sample && '-') +
                  sample
                }
                onCopy={() => {
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 700);
                }}
              >
                <pre
                  className={
                    type
                      ? 'text-blue display-inline ml-10'
                      : 'text-grey display-inline ml-10'
                  }
                >
                  {type
                    ? studyId.toLowerCase().replace('_', '-') +
                      '-' +
                      type +
                      (method && '-') +
                      method +
                      (sample && '-') +
                      sample
                    : 'no_workflow_type_created'}
                </pre>
              </CopyToClipboard>
            }
            content={
              copied ? <Icon name="check" color="green" /> : 'Copy to clipboard'
            }
          />
          <Segment floated="right" basic className="noPadding noMargin">
            <Form.Checkbox
              required
              checked={confirmed}
              disabled={!type || !method || !sample}
              label="Confirm"
              onClick={() => {
                formikProps.setFieldValue(
                  'workflowType',
                  confirmed ? '' : type + '-' + method + '-' + sample,
                );
                setConfirmed(!confirmed);
              }}
            />
          </Segment>
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
