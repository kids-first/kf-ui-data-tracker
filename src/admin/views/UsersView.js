import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery, useMutation} from '@apollo/client';
import {
  Checkbox,
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
  Popup,
} from 'semantic-ui-react';
import {UserList, PermissionGroup} from '../components/UserList';
import {ALL_GROUPS, MY_PROFILE} from '../../state/queries';
import {ALL_USERS, ALL_ORGANIZATIONS} from '../queries';
import {UPDATE_USER, ADD_MEMBER, REMOVE_MEMBER} from '../../state/mutations';

const UsersView = () => {
  const {loading: usersLoading, error, data: userData} = useQuery(ALL_USERS);
  const [searchString, setSearchString] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const [not, setNot] = useState(false);

  const allUsers = userData && userData.allUsers;

  const {data: myProfileData, loading: myProfileLoading} = useQuery(MY_PROFILE);
  const profile = myProfileData && myProfileData.myProfile;

  const {loading: orgsLoading, data: orgsData} = useQuery(ALL_ORGANIZATIONS);
  const defaultLogo =
    'https://raw.githubusercontent.com/kids-first/kf-ui-data-tracker/master/src/assets/logo.svg';
  const orgOptions =
    orgsData && orgsData.allOrganizations.edges.length > 0
      ? orgsData.allOrganizations.edges.map(({node}) => ({
          key: node.id,
          text: node.name,
          value: node.id,
          image: {
            avatar: true,
            src: node.image || defaultLogo,
            alt: node.name,
          },
        }))
      : [];

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [{query: ALL_USERS}],
  });

  const [addMember] = useMutation(ADD_MEMBER, {
    refetchQueries: [{query: ALL_USERS}],
  });

  const [removeMember] = useMutation(REMOVE_MEMBER, {
    refetchQueries: [{query: ALL_USERS}],
  });

  const permissions =
    profile &&
    profile.groups &&
    profile.groups.edges &&
    profile.groups.edges
      .map(({node}) => node.permissions.edges.map(({node}) => node.codename))
      .reduce((prev, curr) => prev.concat(curr));

  const canUpdateUser = permissions && permissions.includes('change_user');
  const canSignOrg = permissions && permissions.includes('change_organization');

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
          (not
            ? !node.groups.edges
                .map(({node}) => node.id)
                .includes(selectedGroup)
            : node.groups.edges
                .map(({node}) => node.id)
                .includes(selectedGroup))) &&
        (!selectedOrg ||
          (not
            ? !node.organizations.edges
                .map(({node}) => node.id)
                .includes(selectedOrg)
            : node.organizations.edges
                .map(({node}) => node.id)
                .includes(selectedOrg))) &&
        [node.username, node.displayName, node.email]
          .join(' ')
          .toLowerCase()
          .includes(searchString.toLowerCase()),
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
            <span className="pr-5">Filter by:</span>
            <Popup
              inverted
              on="hover"
              position="top center"
              content="When checked, show users that do not belong to selected user group or selected organization"
              trigger={
                <Checkbox
                  className="ml-10 mr-14"
                  label="NOT"
                  onChange={() => setNot(!not)}
                  checked={not}
                />
              }
            />
            <Form.Group inline width={10} className="mb-0">
              <Form.Field
                aria-label="group-filter"
                control={Select}
                clearable
                placeholder="User Group"
                loading={loading}
                options={groupOptions || []}
                onChange={(e, {name, value}) => setSelectedGroup(value)}
              />
              <Form.Field
                aria-label="organization-filter"
                control={Select}
                clearable
                placeholder="Organization"
                loading={orgsLoading}
                options={orgOptions || []}
                onChange={(e, {value}) => setSelectedOrg(value)}
              />
            </Form.Group>
            <Form.Field
              className="pr-0"
              width={6}
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
        <Divider className="mb-0" />
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
                orgOptions={orgOptions}
                updateUser={canUpdateUser ? updateUser : null}
                addMember={canSignOrg ? addMember : null}
                removeMember={canSignOrg ? removeMember : null}
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
