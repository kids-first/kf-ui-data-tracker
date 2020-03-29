import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {
  Container,
  Dimmer,
  Divider,
  Header,
  Loader,
  Select,
  Segment,
  Message,
} from 'semantic-ui-react';
import {UserList} from '../components/UserList';
import {ALL_USERS, ALL_GROUPS, MY_PROFILE} from '../../state/queries';
import {UPDATE_USER} from '../../state/mutations';

const UsersView = () => {
  const {loading: usersLoading, error, data: userData} = useQuery(ALL_USERS);
  const [selectedGroup, setSelectedGroup] = useState('');
  const allUsers = userData && userData.allUsers;

  const {data: myProfileData, loading: myProfileLoading} = useQuery(MY_PROFILE);
  const profile = myProfileData && myProfileData.myProfile;

  const [updateUser] = useMutation(UPDATE_USER);
  const canUpdateUser =
    profile &&
    profile.groups.edges
      .map(({node}) => node.permissions.edges.map(({node}) => node.codename))
      .flat(2)
      .includes('change_user');

  // Compute options available for choosing groups
  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError,
  } = useQuery(ALL_GROUPS);
  const groupOptions =
    groupsData &&
    groupsData.allGroups.edges.map(({node}) => ({
      key: node.name,
      text: node.name,
      value: node.id,
    }));

  const filteredList =
    allUsers &&
    allUsers.edges.filter(
      ({node}) =>
        !selectedGroup ||
        node.groups.edges.map(({node}) => node.id).includes(selectedGroup),
    );

  const loading = usersLoading || myProfileLoading || groupsLoading;

  if (error || groupsError)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - Users - Error</title>
        </Helmet>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={groupsError.message || error.message}
        />
      </Container>
    );
  return (
    <Container as={Segment} basic>
      <Helmet>
        <title>KF Data Tracker - Users</title>
      </Helmet>
      <Header as="h3">Data Tracker Users</Header>
      <Segment basic>
        All users registered in the data tracker are available here.
      </Segment>
      <Segment basic>
        <span className="smallLabel">Filter by:</span>
        <Select
          clearable
          placeholder="User Group"
          loading={loading}
          options={groupOptions}
          onChange={(e, {name, value}) => setSelectedGroup(value)}
        />
        <Divider />
        {loading ? (
          <Segment basic padded="very">
            <Dimmer active inverted>
              <Loader inverted>Loading users...</Loader>
            </Dimmer>
          </Segment>
        ) : (
          <>
            {filteredList.length > 0 ? (
              <UserList
                users={filteredList}
                groupOptions={groupOptions}
                updateUser={canUpdateUser ? updateUser : null}
              />
            ) : (
              <p>No users data available</p>
            )}
          </>
        )}
      </Segment>
    </Container>
  );
};

export default UsersView;
