import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Header,
  Label,
  Message,
  Dropdown,
} from 'semantic-ui-react';

const LinkStudyForm = ({
  formikProps,
  apiErrors,
  allStudies,
  loading,
  disabled,
}) => {
  const {
    errors,
    touched,
    handleBlur,
    setFieldValue,
    handleSubmit,
  } = formikProps;
  const options =
    allStudies && allStudies.edges && allStudies.edges.length > 0
      ? allStudies.edges.map(({node}) => ({
          key: node.id,
          value: node.id,
          text: (
            <>
              <b>{node.kfId}</b> - {node.name}
            </>
          ),
          content: (
            <>
              <b>{node.kfId}</b> - {node.name}
            </>
          ),
        }))
      : [];
  return (
    <Form>
      <Header size="small">Link project to a study</Header>
      Choose a study to link this project to. A project may only be linked to
      one study at a time.
      <Form.Field>
        <label>Study</label>
        <Dropdown
          fluid
          selection
          id="studyId"
          name="studyId"
          disabled={options.length === 0 || disabled}
          onBlur={handleBlur}
          options={options}
          placeholder={
            options.length === 0
              ? 'There are no studies to link'
              : 'Choose a study'
          }
          onChange={(e, {name, value}) => {
            setFieldValue('studyId', value);
          }}
          error={
            touched.projectId !== undefined &&
            errors.projectId !== undefined &&
            errors.projectId.length > 0 &&
            !disabled
          }
        />
        {touched.projectId &&
          errors.projectId &&
          errors.projectId.length > 0 &&
          !disabled && (
            <Label pointing basic color="red">
              {errors.projectId}
            </Label>
          )}
      </Form.Field>
      <Button
        primary
        type="submit"
        content="Link"
        loading={loading}
        disabled={!touched.studyId || loading}
        onClick={handleSubmit}
      />
      {apiErrors && <Message negative content={apiErrors} />}
    </Form>
  );
};

LinkStudyForm.propTypes = {
  /** Error message returned from server or API */
  apiErrors: PropTypes.string,
  /** Array of all unlinked projects */
  allStudies: PropTypes.object,
};

export default LinkStudyForm;
