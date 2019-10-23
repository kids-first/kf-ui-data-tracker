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
  defaultState = {
    slackNotify: false,
    slackMemberId: '',
    email: '',
    emailNotify: false,
  },
}) => {
  const [slackNotify, setSlackNotify] = useState(defaultState.slackNotify);
  const [slackMemId, setSlackMemId] = useState(defaultState.slackMemberId);
  const [emailNotify, setEmailNotify] = useState(defaultState.emailNotify);

  return (
    <Segment>
      <Form
        onSubmit={ev => {
          ev.preventDefault();
          handleSubmit(slackNotify, slackMemId, emailNotify);
        }}
      >
        <Form.Group>
          <Form.Field>
            <label htmlFor="slackid">Slack ID:</label>
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
            onChange={() => setSlackNotify(!slackNotify)}
            label="SLACK me daily activity reports of my subscribed studies"
          />
          <label htmlFor="slack-notify" />
        </Form.Field>
        <Form.Field>
          <Checkbox
            name="notify"
            checked={emailNotify}
            onChange={() => setEmailNotify(!emailNotify)}
            label="EMAIL me daily activity reports of my subscribed studies"
          />
          <label htmlFor="eamil-notify" />
        </Form.Field>

        <Button type="submit" primary loading={loading}>
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
