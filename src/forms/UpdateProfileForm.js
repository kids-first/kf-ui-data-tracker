import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Checkbox, Form, Message, Segment} from 'semantic-ui-react';

/**
 * A form for the user to update their configurable profile settings
 */
const UpdateProfileForm = ({
  handleSubmit,
  errors = null,
  message = null,
  loading = false,
  defaultState = {slackNotify: false, slackMemberId: ''},
}) => {
  const [slackNotify, setSlackNotify] = useState(defaultState.slackNotify);
  const [slackMemId, setSlackMemId] = useState(defaultState.slackMemberId);

  return (
    <Segment>
      <Form
        onSubmit={ev => {
          ev.preventDefault();
          handleSubmit(slackNotify, slackMemId);
        }}
      >
        <p>
          If you are a member of the Kids-First slack channel, we can send you
          daily updates when there are changes made to the studies of your
          choosing.
        </p>
        <Form.Group>
          <Form.Field>
            <label htmlForm="slackid">Slack ID:</label>
            <input
              name="slackid"
              type="text"
              placeholder="U1234ABC"
              value={slackMemId}
              onChange={ev => setSlackMemId(ev.target.value)}
            />
            <a href="https://medium.com/@moshfeu/how-to-find-my-member-id-in-slack-workspace-d4bba942e38c">
              Where do I find my id?
            </a>
          </Form.Field>
        </Form.Group>
        <Form.Field>
          <Checkbox
            name="notify"
            checked={slackNotify}
            onChange={ev => setSlackNotify(ev.target.value)}
            label="Send me daily activity reports of my subscribed studies"
          />
          <label htmlForm="notify" />
        </Form.Field>
        <Button type="submit" color="primary" loading={loading}>
          Save
        </Button>
        <Message info hidden={!message} content={message} />
        <Message negative hidden={!errors} content={errors} />
      </Form>
    </Segment>
  );
};

UpdateProfileForm.propTypes = {
  /** Function to perform on form submission */
  handleSubmit: PropTypes.func.isRequired,
  /** Any errors that occured when submitting the form */
  errors: PropTypes.string,
  /** Any messages to display next to the submission button */
  message: PropTypes.string,
  /** If the form is being submitted */
  loading: PropTypes.bool,
  /** Default form values */
  defaultState: PropTypes.object,
};

export default UpdateProfileForm;
