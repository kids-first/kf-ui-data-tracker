import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'kf-uikit';

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
    <form
      onSubmit={ev => {
        ev.preventDefault();
        handleSubmit(slackNotify, slackMemId);
      }}
      className="row-4 cell-12 bg-lightGrey p-16"
    >
      <p className="font-title">
        If you are a member of the Kids-First slack channel, we can send you
        daily updates when there are changes made to the studies of your
        choosing.
      </p>
      <label htmlFor="slackid">Slack ID: </label>
      <input
        className="FileEditor--Input mx-8 px-8"
        name="slackid"
        type="text"
        placeholder="U1234ABC"
        value={slackMemId}
        onChange={ev => setSlackMemId(ev.target.value)}
      />
      <a href="https://medium.com/@moshfeu/how-to-find-my-member-id-in-slack-workspace-d4bba942e38c">
        Where do I find my id?
      </a>
      <br />
      <br />
      <input
        className="h-4 w-4"
        name="notify"
        type="checkbox"
        checked={slackNotify}
        onChange={ev => setSlackNotify(ev.target.value)}
      />
      <label className="pl-8" htmlFor="notify">
        Send me daily activity reports of my subscribed studies
      </label>

      <br />
      <Button type="submit" color="primary" disabled={loading}>
        Save
      </Button>
      <span className="pl-8">{message && message}</span>
      <span className="text-red pl-8">{errors && errors}</span>
    </form>
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
