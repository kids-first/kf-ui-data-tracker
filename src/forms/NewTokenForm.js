import React from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Message, Segment} from 'semantic-ui-react';

const NewTokenForm = ({onSubmit, error, loading}) => (
  <Segment>
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
      </Form.Field>
      <Button type="submit" loading={loading}>
        Create
      </Button>
      <Message hidden={!error} negative content={error} />
    </Form>
  </Segment>
);

NewTokenForm.propTypes = {
  /** Function to perform on form submission */
  onSubmit: PropTypes.func.isRequired,
  /** Any errors that occured when submitting the form */
  error: PropTypes.string,
  /** If the form is being submitted */
  loading: PropTypes.bool,
};

export default NewTokenForm;
