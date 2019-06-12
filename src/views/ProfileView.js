import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import {MY_PROFILE} from '../state/queries';
import {UPDATE_PROFILE} from '../state/mutations';
import {Avatar, GridContainer} from 'kf-uikit';
import UpdateProfileForm from '../forms/UpdateProfileForm';
import StudySubscriptionContanier from '../containers/StudySubscriptionContainer';
/**
 * A user's profile view
 */
const ProfileView = ({
  data: {loading, error, myProfile: profile},
  updateProfile,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState();
  const [errors, setErrors] = useState();

  const handleSave = (slackNotify, slackMemberId) => {
    setMessage();
    setSubmitting(true);
    // Call update mutation
    updateProfile({variables: {slackNotify, slackMemberId}})
      .then(resp => {
        setMessage('Saved!');
        setSubmitting(false);
      })
      .catch(err => {
        setErrors(err.message);
        setSubmitting(false);
      });
  };

  if (loading) return <span>Loading...</span>;
  if (error) return <span>{error.message}</span>;

  const fields = {
    username: 'Username',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
  };
  const groups = JSON.parse(localStorage.getItem('groups'));
  const roles = JSON.parse(localStorage.getItem('roles'));

  return (
    <GridContainer collapsed={true}>
      <h3 className="row-1 cell-12 text-blue font-normal">Your Profile</h3>
      <Avatar
        className="row-2 cell-1 align-right mx-16"
        size={100}
        imgUrl={profile.picture}
      />
      <div className="row-2 cell-5">
        {Object.keys(fields).map(field => (
          <div className="row-2 cell-8">
            {fields[field]}: <input disabled value={profile[field]} />
          </div>
        ))}
      </div>
      <div className="row-2 cell-5 text-xs">
        <h4>Your Roles:</h4>
        <ul className="inline-block list-none">
          {roles.map((role, i) => (
            <li className="inline-block rounded-sm bg-lightGrey" key={i}>
              {role}
            </li>
          ))}
        </ul>
        <h4>Your Groups:</h4>
        <ul>
          {groups.map((group, i) => (
            <li className="inline-block rounded-sm bg-lightGrey" key={i}>
              {group}
            </li>
          ))}
        </ul>
      </div>
      <h3 className="row-3 cell-12 text-blue font-normal">Notifications</h3>
      <UpdateProfileForm
        handleSubmit={handleSave}
        defaultState={{
          slackNotify: profile.slackNotify,
          slackMemberId: profile.slackMemberId,
        }}
        errors={errors}
        loading={submitting}
        message={message}
      />
      <h3 className="row-5 cell-12 text-blue font-normal">
        Your Subscriptions
      </h3>
      <p className="row-6 cell-12 font-title">
        We'll notify you of daily activity when you subscribe to studies below
      </p>
      <div className="row-7 cell-12">
        <StudySubscriptionContanier />
      </div>
    </GridContainer>
  );
};

export default compose(
  graphql(MY_PROFILE),
  graphql(UPDATE_PROFILE, {name: 'updateProfile'}),
)(ProfileView);
