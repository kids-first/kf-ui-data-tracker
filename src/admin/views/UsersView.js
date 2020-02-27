import React, {useState} from 'react';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/react-hooks';
import {
  Container,
  Dimmer,
  Divider,
  Header,
  Loader,
  Select,
  Segment,
  Message,
  List,
  Image,
} from 'semantic-ui-react';
import {userRoleOptions} from '../../common/enums';
import {longDate} from '../../common/dateUtils';
import TimeAgo from 'react-timeago';
import defaultAvatar from '../../assets/defaultAvatar.png';
import {ALL_USERS} from '../../state/queries';

const UsersView = () => {
  const {loading, error, data: userData} = useQuery(ALL_USERS);
  const [selectedRole, setSelectedRole] = useState('');
  const allUsers = userData && userData.allUsers;

  const filterList = () => {
    var filteredList = allUsers && allUsers.edges;
    if (selectedRole.length > 0) {
      filteredList =
        allUsers &&
        allUsers.edges.filter(({node}) => node.roles.includes(selectedRole));
    }
    return filteredList;
  };

  if (error)
    return (
      <Container as={Segment} basic>
        <Helmet>
          <title>KF Data Tracker - Users - Error</title>
        </Helmet>
        <Message
          negative
          icon="warning circle"
          header="Error"
          content={error.message}
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
          placeholder="User Role"
          loading={loading}
          options={userRoleOptions}
          onChange={(e, {name, value}) => setSelectedRole(value.toUpperCase())}
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
            {filterList().length > 0 ? (
              <List relaxed="very">
                {filterList().map(({node}) => (
                  <List.Item key={node.id} data-testid="user-item">
                    <Image avatar src={node.picture || defaultAvatar} />
                    <List.Content>
                      <List.Header>
                        {node.username}
                        {node.email && <small> - {node.email}</small>}
                      </List.Header>
                      <List.Description>
                        {node.roles.length > 0
                          ? node.roles.join(', ')
                          : 'Unknown role'}
                      </List.Description>
                    </List.Content>
                    <List.Content floated="right">
                      Joined{' '}
                      <TimeAgo
                        live={false}
                        date={node.dateJoined}
                        title={longDate(node.dateJoined)}
                      />
                    </List.Content>
                  </List.Item>
                ))}
              </List>
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
