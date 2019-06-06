import React, {useState} from 'react';
import {graphql, compose} from 'react-apollo';
import jwtDecode from 'jwt-decode';
import {MY_PROFILE} from '../state/queries';
import {UPDATE_PROFILE} from '../state/mutations';
import {Avatar, GridContainer} from 'kf-uikit';
import UpdateProfileForm from '../forms/UpdateProfileForm';

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

  const token =
    localStorage.getItem('egoToken') || localStorage.getItem('accessToken');
  const decoded = jwtDecode(token);
  const groups =
    decoded['https://kidsfirstdrc.org/groups'] || decoded.context.groups;
  const roles =
    decoded['https://kidsfirstdrc.org/roles'] || decoded.context.roles;
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
    </GridContainer>
  );
};

export default compose(
  graphql(MY_PROFILE),
  graphql(UPDATE_PROFILE, {name: 'updateProfile'}),
)(ProfileView);
