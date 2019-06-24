import React, {useState} from 'react';
import classes from 'classnames';
import {graphql, compose} from 'react-apollo';
import jwtDecode from 'jwt-decode';
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

  const token =
    localStorage.getItem('egoToken') || localStorage.getItem('accessToken');
  const decoded = jwtDecode(token);
  const groups =
    decoded['https://kidsfirstdrc.org/groups'] || decoded.context.groups;
  const roles =
    decoded['https://kidsfirstdrc.org/roles'] || decoded.context.roles;

  const sectionHeader = classes(
    'cell-12',
    'text-blue',
    'mt-16',
    'py-8',
    'border-b',
    'border-mediumGrey',
  );

  return (
    <>
      <div className="Profile--Header">
        <GridContainer>
          <Avatar className="cell-1" size={150} imgUrl={profile.picture} />
          <div className="cell-10">
            <h2 className="text-white font-bold">
              {profile.firstName} {profile.lastName}
            </h2>
            <ul className="mx-0 px-0 list-none">
              {roles.length > 0 ? (
                roles.map((role, i) => (
                  <li
                    className="inline-block rounded-sm bg-lightGrey text-xs px-8 mr-8"
                    key={i}
                  >
                    {role}
                  </li>
                ))
              ) : (
                <li
                  className="inline-block text-lightGrey italic text-sm"
                  key={0}
                >
                  No roles assigned
                </li>
              )}
            </ul>
          </div>
        </GridContainer>
      </div>
      <GridContainer>
        <h3 className={sectionHeader}>Profile</h3>
        <div className="cell-12">
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
          <p>Groups:</p>
          <ul>
            {groups.length > 0 ? (
              groups.map((group, i) => (
                <li
                  className="inline-block rounded-sm bg-lightGrey text-xs px-8 mr-8"
                  key={i}
                >
                  {group}
                </li>
              ))
            ) : (
              <li className="inline-block text-grey italic text-sm" key={0}>
                No groups assigned
              </li>
            )}
          </ul>
        </div>
        <h3 className={sectionHeader}>Notifications</h3>
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
        <h3 className={sectionHeader}>Subscriptions</h3>
        <p className="cell-12 font-title">
          We'll notify you of daily activity when you subscribe to studies below
        </p>
        <div className="cell-12">
          <StudySubscriptionContanier />
        </div>
      </GridContainer>
    </>
  );
};

export default compose(
  graphql(MY_PROFILE),
  graphql(UPDATE_PROFILE, {name: 'updateProfile'}),
)(ProfileView);
