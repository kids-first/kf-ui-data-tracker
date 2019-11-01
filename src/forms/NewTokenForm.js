import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Form, Message, Segment} from 'semantic-ui-react';

const NewTokenForm = ({onSubmit, error, loading}) => {
  const [name, setName] = useState('');

  return (
    <Segment>
      <Form
        onSubmit={() => {
          onSubmit(name);
          setName('');
        }}
      >
        <Form.Field>
          <label>
            Name:
            <input
              data-testid="token-name-input"
              focus={name.length > 0 ? 'true' : 'false'}
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
        </Form.Field>
        <Button type="submit" loading={loading} disabled={name === ''}>
          Create
        </Button>
        <Message hidden={!error} negative content={error} />
      </Form>
    </Segment>
  );
};

NewTokenForm.propTypes = {
  /** Function to perform on form submission */
  onSubmit: PropTypes.func.isRequired,
  /** Any errors that occured when submitting the form */
  error: PropTypes.string,
  /** If the form is being submitted */
  loading: PropTypes.bool,
};

export default NewTokenForm;
