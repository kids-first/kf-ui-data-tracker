import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {NavLink} from 'react-router-dom';
import {MY_PROFILE} from '../../state/queries';
import {ADD_COLLABORATOR} from '../../state/mutations';
import {
  Button,
  Container,
  Dropdown,
  Icon,
  Image,
  Menu,
} from 'semantic-ui-react';
import defaultAvatar from '../../assets/defaultAvatar.png';
import logo from '../../assets/logo.svg';
import {getPermissions} from '../../common/permissions.js';
import {auth} from '../../state/auth';
import InviteModal from '../../modals/InviteModal';

const Nav = props => <NavLink exact {...props} activeClassName="active" />;

/**
 * Each item will be displayed only if the user has permission to view it.
 * Only displays the admin drop down if the user has permissions needed for
 * one or more of the items.
 */
const AdminDropdown = ({profile}) => {
  const permissions = getPermissions(profile);

  const items = [
    {
      name: 'Configuration',
      route: '/configuration',
      icon: 'settings',
      permission: 'view_settings',
    },
    {
      name: 'Buckets',
      route: '/buckets',
      icon: 'trash',
      permission: 'view_bucket',
    },
    {
      name: 'Tokens',
      route: '/tokens',
      icon: 'key',
      permission: 'view_downloadtoken',
    },
    {
      name: 'Cavatica Projects',
      route: '/cavatica-projects',
      icon: 'folder open',
      permission: 'view_study',
    },
    {
      name: 'Events',
      route: '/events',
      icon: 'history',
      permission: 'view_event',
    },
    {
      name: 'Users',
      route: '/users',
      icon: 'users',
      permission: 'view_group',
    },
  ];

  const Item = ({name, route, icon, permission}) => (
    <Dropdown.Item as={Nav} to={route}>
      <Icon name={icon} />
      {name}
    </Dropdown.Item>
  );

  // Construct menu nav components
  const menuItems = items
    .filter(item => permissions.includes(item.permission))
    .map(item => <Item key={item.route} {...item} />);

  return (
    menuItems.length > 0 && (
      <Dropdown trigger={'Admin'} className="link item">
        <Dropdown.Menu>{menuItems}</Dropdown.Menu>
      </Dropdown>
    )
  );
};

const AddUserButton = ({profile}) => {
  const [addCollaborator] = useMutation(ADD_COLLABORATOR);
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!profile) return null;

  return (
    <Menu.Item>
      <Button
        icon
        primary
        labelPosition="right"
        onClick={() => setShowInviteModal(!showInviteModal)}
      >
        <Icon name="add user" />
        Invite User
      </Button>
      <InviteModal
        open={showInviteModal}
        onCloseDialog={() => setShowInviteModal(false)}
        inviteCollaborator={addCollaborator}
      />
    </Menu.Item>
  );
};

const Header = () => {
  const {loading, error, data} = useQuery(MY_PROFILE);
  const profile = data && data.myProfile;

  const [loggedIn, setLoggedIn] = useState(profile !== undefined);
  const picUrl = profile && profile.picture ? profile.picture : defaultAvatar;
  const picAlt = profile && profile.username ? profile.username : 'profile';
  if (!loading && profile && !loggedIn && !error) {
    setLoggedIn(true);
  }

  return (
    <Menu attached size="large">
      <Container>
        <Menu.Item>
          <img src={logo} alt="Kids First logo" />
        </Menu.Item>
        <Menu.Item header as={NavLink} to="/" activeClassName="">
          Data Tracker
        </Menu.Item>
        {loggedIn && (
          <>
            <Menu.Item as={Nav} to="/" content="Studies" />
            <Menu.Menu position="right">
              <AddUserButton profile={profile} />
              <AdminDropdown profile={profile} />
              <Dropdown
                trigger={
                  <>
                    <Image avatar src={picUrl} alt={picAlt} />
                    {profile.username}
                  </>
                }
                className="link item"
              >
                <Dropdown.Menu>
                  <Dropdown.Item as={Nav} to="/profile">
                    <Icon name="user" />
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Nav}
                    to="/logout"
                    onClick={() => {
                      setLoggedIn(false);
                      auth.logout();
                    }}
                  >
                    <Icon name="log out" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          </>
        )}
      </Container>
    </Menu>
  );
};

export default Header;
