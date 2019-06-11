import React from 'react';
import {graphql} from 'react-apollo';
import {MY_PROFILE} from '../../state/queries';
import {Avatar, Icon} from 'kf-uikit';

const ProfileDropdown = ({
  data: {loading, error, myProfile: profile},
  history,
}) => {
  return (
    <div className="Dropdown" key={0}>
      {profile && (
        <button
          type="button"
          className="Dropdown--button items-center"
          tabIndex="0"
        >
          <Avatar
            className="mr-12"
            imgUrl={profile.picture}
            userName={profile.username}
            userEmail={profile.email}
          />

          {profile.firstName || profile.userName}
          <Icon
            className="mt-8 ml-12"
            width={16}
            height={16}
            kind="chevron-down"
          />
        </button>
      )}
      <div className="Dropdown--container pt-40">
        <ul className="Dropdown--list">
          <li key={1}>
            <button
              type="button"
              className="Dropdown--item w-full"
              tabIndex="0"
              onClick={() => history.push('/profile')}
            >
              <Icon width={12} height={12} kind="users" />
              Profile
            </button>
          </li>
          <li key={2}>
            <button
              type="button"
              className="Dropdown--item w-full"
              tabIndex="0"
              onClick={() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('idToken');
                localStorage.removeItem('egoToken');
                history.go();
              }}
            >
              <Icon width={12} height={12} kind="previous" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default graphql(MY_PROFILE)(ProfileDropdown);
