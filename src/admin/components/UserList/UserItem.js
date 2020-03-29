import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Dropdown, Image, List} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {longDate} from '../../../common/dateUtils';
import defaultAvatar from '../../../assets/defaultAvatar.png';

const Actions = ({user, groupOptions, updateUser}) => {
  const [loading, setLoading] = useState(false);

  const onChange = (ev, data) => {
    setLoading(true);
    updateUser({variables: {user: user.id, groups: data.value}}).then(resp => {
      setLoading(false);
    });
  };

  if (updateUser instanceof Function) {
    return (
      <Dropdown
        multiple
        selection
        clearable
        disabled={!updateUser instanceof Function || loading}
        loading={loading}
        value={user.groups.edges.map(({node}) => node.id)}
        placeholder="Groups"
        options={groupOptions}
        onChange={onChange}
      />
    );
  }

  return null;
};

/**
 * Display a list of collaborators
 */
const UserItem = ({user, groupOptions, updateUser}) => (
  <List.Item key={user.id} data-testid="user-item">
    <Image avatar src={user.picture || defaultAvatar} />
    <List.Content>
      <List.Header>
        {user.username}
        {user.email && <small> - {user.email}</small>}
      </List.Header>
      <List.Description>
        Joined{' '}
        <TimeAgo
          live={false}
          date={user.dateJoined}
          title={longDate(user.dateJoined)}
        />
      </List.Description>
    </List.Content>
    <List.Content floated="right">
      <Actions
        user={user}
        groupOptions={groupOptions}
        updateUser={updateUser}
      />
    </List.Content>
    {user.dateJoined && <List.Content floated="right" />}
  </List.Item>
);

UserItem.propTypes = {
  /** The user to display */
  user: PropTypes.object,
  /** Array of options to display in a group selection */
  groupOptions: PropTypes.array,
  /** Mutation to update an user */
  updateUser: PropTypes.func,
};

export default UserItem;
