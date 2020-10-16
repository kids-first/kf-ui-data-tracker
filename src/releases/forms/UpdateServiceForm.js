import React from 'react';
import {Formik} from 'formik';
import {Form} from 'semantic-ui-react';

const UpdateServiceForm = ({service, onSubmit, formRef, error}) => (
  <Formik
    initialValues={{...service}}
    onSubmit={(values, actions) => {
      onSubmit(values);
    }}
    render={props => (
      <Form onSubmit={props.handleSubmit} ref={formRef}>
      <Form.Input
        fluid
        required
        name="name"
        label="Service Name"
        placeholder="My Service"
        onChange={props.handleChange}
        onBlur={props.handleBlur}
        value={props.values.name}
      />
      <Form.Input
        fluid
        required
        error={
          error && error.message.includes('url')
        }
        name="url"
        label="Service Endpoint"
        placeholder="http://myservice"
        onChange={props.handleChange}
        onBlur={props.handleBlur}
        value={props.values.url}
      />
      <Form.TextArea
        label="Description"
        name="description"
        placeholder="Tell us more about your service..."
        onChange={props.handleChange}
        onBlur={props.handleBlur}
        value={props.values.description}
      />
      </Form>
    )}
  />
);

export default UpdateServiceForm;
