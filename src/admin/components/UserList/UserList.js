import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'semantic-ui-react';
import UserItem from './UserItem';

/**
 * Display a list of users
 */
const UsersList = ({
  users,
  groupOptions,
  updateUser,
  orgOptions,
  addMember,
  removeMember,
}) => {
  const sortedUsers = users.sort(({node: u1}, {node: u2}) =>
    u1.username.localeCompare(u2.username, 'en-US', {
      caseFirst: 'upper',
      sensitivity: 'case',
      usage: 'sort',
    }),
  );

  return (
    <List relaxed divided>
      {users &&
        sortedUsers.length > 0 &&
        sortedUsers.map(({node}) => (
          <UserItem
            key={node.id}
            user={node}
            groupOptions={groupOptions}
            updateUser={updateUser}
            orgOptions={orgOptions}
            addMember={addMember}
            removeMember={removeMember}
          />
        ))}
    </List>
  );
};

UsersList.propTypes = {
  /** Array of users */
  users: PropTypes.array,
  /** Array of options to display in a group selection */
  groupOptions: PropTypes.array,
  /** Mutation to update an user */
  updateUser: PropTypes.func,
};

export default UsersList;
