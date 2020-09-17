import React from 'react';
import {Button, Form, Message} from 'semantic-ui-react';
import {Formik} from 'formik';

const NewValidationForm = ({
  values,
  errors,
  touched,
  isSubmitting,
  isValid,
  handleBlur,
  handleChange,
  handleSubmit,
  version,
  setFieldValue,
  setFieldTouched,
  studies,
}) => {
  return (
    <>
      <Form.Field>
        <label>
          Version kf_ids, comma separated
          <input
            type="text"
            name="versions"
            placeholder="FV_00000000"
            value={values.versions}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </label>
      </Form.Field>
      <Button type="submit" loading={isSubmitting} disabled={!isValid}>
        Run
      </Button>
      <Message
        hidden={!errors.all}
        negative
        content={<pre>{JSON.stringify(errors, null, 2)}</pre>}
      />
    </>
  );
};

const FormikWrapper = ({handleSubmit, ...props}) => (
  <Formik
    initialValues={{versions: ''}}
    validate={values => {
      const errors = {};
      const versions = values.versions.replace(/\s/g, '').split(',');
      if (versions.length <= 0) {
        errors.versions = 'Required';
      }
      return errors;
    }}
    onSubmit={handleSubmit}
  >
    {formikProps => (
      <Form onSubmit={formikProps.handleSubmit}>
        <NewValidationForm {...props} {...formikProps} />
      </Form>
    )}
  </Formik>
);

export default FormikWrapper;
