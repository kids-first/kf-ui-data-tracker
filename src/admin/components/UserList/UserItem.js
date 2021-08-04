import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Dropdown, Image, List} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {longDate} from '../../../common/dateUtils';
import defaultAvatar from '../../../assets/defaultAvatar.png';

const Actions = ({
  user,
  groupOptions,
  updateUser,
  orgOptions,
  addMember,
  removeMember,
}) => {
  const [loading, setLoading] = useState(false);

  const onChange = (ev, data) => {
    setLoading(true);
    updateUser({variables: {user: user.id, groups: data.value}}).then(resp => {
      setLoading(false);
    });
  };

  const userOrg = user.organizations.edges.map(({node}) => node.id);

  const onOrgSelect = (ev, data) => {
    setLoading(true);
    if (data.value.length > userOrg.length) {
      const add = data.value.filter(x => !userOrg.includes(x))[0];
      addMember({variables: {user: user.id, organization: add}}).then(resp => {
        setLoading(false);
      });
    } else if (data.value.length < userOrg.length) {
      const remove = userOrg.filter(x => !data.value.includes(x))[0];
      removeMember({variables: {user: user.id, organization: remove}}).then(
        resp => {
          setLoading(false);
        },
      );
    }
  };

  return (
    <>
      {updateUser instanceof Function && (
        <Dropdown
          className="text-12"
          multiple
          selection
          clearable
          fluid
          disabled={!updateUser instanceof Function || loading}
          loading={loading}
          value={user.groups.edges.map(({node}) => node.id)}
          placeholder="Groups"
          options={groupOptions}
          onChange={onChange}
        />
      )}
      {addMember instanceof Function && removeMember instanceof Function && (
        <Dropdown
          className="mt-6 text-12"
          multiple
          selection
          clearable
          fluid
          disabled={
            !addMember instanceof Function || !removeMember instanceof Function
          }
          loading={loading}
          value={userOrg}
          placeholder="Organizations"
          options={orgOptions}
          onChange={onOrgSelect}
        />
      )}
    </>
  );
};

/**
 * Display a list of collaborators
 */
const UserItem = ({
  user,
  groupOptions,
  updateUser,
  orgOptions,
  addMember,
  removeMember,
}) => (
  <List.Item key={user.id} data-testid="user-item">
    <Image avatar src={user.picture || defaultAvatar} alt={user.displayName} />
    <List.Content>
      <List.Header>{user.displayName}</List.Header>
      <List.Description className="text-12">
        {user.email}
        <br />
        Joined{' '}
        <TimeAgo
          live={false}
          date={user.dateJoined}
          title={longDate(user.dateJoined)}
        />
      </List.Description>
    </List.Content>
    <List.Content floated="right" className="min-w-200">
      <Actions
        user={user}
        groupOptions={groupOptions}
        updateUser={updateUser}
        orgOptions={orgOptions}
        addMember={addMember}
        removeMember={removeMember}
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
