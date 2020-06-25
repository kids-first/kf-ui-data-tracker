import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {
  Container,
  Dimmer,
  Divider,
  Form,
  Header,
  Input,
  Loader,
  Select,
  Segment,
  Message,
} from 'semantic-ui-react';
import {UserList, PermissionGroup} from '../components/UserList';
import {ALL_USERS, ALL_GROUPS, MY_PROFILE} from '../../state/queries';
import {UPDATE_USER} from '../../state/mutations';

const UsersView = () => {
  const {loading: usersLoading, error, data: userData} = useQuery(ALL_USERS);
  const [searchString, setSearchString] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const allUsers = userData && userData.allUsers;

  const {data: myProfileData, loading: myProfileLoading} = useQuery(MY_PROFILE);
  const profile = myProfileData && myProfileData.myProfile;

  const [updateUser] = useMutation(UPDATE_USER);

  const permissions =
    profile &&
    profile.groups &&
    profile.groups.edges &&
    profile.groups.edges
      .map(({node}) => node.permissions.edges.map(({node}) => node.codename))
      .reduce((prev, curr) => prev.concat(curr));

  const canUpdateUser = permissions && permissions.includes('change_user');

  // Compute options available for choosing groups
  const {
    data: groupsData,
    loading: groupsLoading,
    error: groupsError,
  } = useQuery(ALL_GROUPS);
  // Group permissions are sorted by the object
  // Permission codename in action_object format, e.g. "view_event", "add_file"
  const groupOptions =
    groupsData &&
    groupsData.allGroups.edges.map(({node}) => ({
      key: node.name,
      text: node.name,
      value: node.id,
      permissions: node.permissions.edges
        .map(({node}) => ({
          key: node.codename,
          value: node.name,
        }))
        .sort((a, b) =>
          a.key.split('_').slice(-1)[0] > b.key.split('_').slice(-1)[0]
            ? 1
            : -1,
        ),
    }));

  const filteredList =
    allUsers &&
    allUsers.edges.filter(
      ({node}) =>
        (!selectedGroup ||
          node.groups.edges.map(({node}) => node.id).includes(selectedGroup)) &&
        (!searchString ||
          node.username.includes(searchString) ||
          node.firstName.includes(searchString) ||
          node.lastName.includes(searchString) ||
          node.email.includes(searchString)),
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
          content={(groupsError && groupsError.message) || error.message}
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
        <Header as="h4">User group permissions</Header>
        {groupOptions && <PermissionGroup groupOptions={groupOptions} />}
        <Header as="h4">User list</Header>
        <Form widths="equal">
          <Form.Group inline>
            <Form.Field
              label="Filter by:"
              aria-label="group-filter"
              width={8}
              control={Select}
              clearable
              placeholder="User Group"
              loading={loading}
              options={groupOptions || []}
              onChange={(e, {name, value}) => setSelectedGroup(value)}
            />
            <Form.Field
              width={8}
              control={Input}
              aria-label="userSearch"
              iconPosition="left"
              icon="search"
              placeholder="Search by name or email"
              onChange={(e, {value}) => setSearchString(value)}
              value={searchString}
            />
          </Form.Group>
        </Form>
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
