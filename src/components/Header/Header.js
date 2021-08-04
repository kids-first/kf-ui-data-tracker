import React, {useState} from 'react';
import {useQuery, useMutation} from '@apollo/client';
import {NavLink, useHistory} from 'react-router-dom';
import {MY_PROFILE, ALL_STUDIES} from '../../state/queries';
import {ADD_COLLABORATOR} from '../../state/mutations';
import {
  Button,
  Container,
  Dropdown,
  Icon,
  Image,
  Label,
  Menu,
} from 'semantic-ui-react';
import defaultAvatar from '../../assets/defaultAvatar.png';
import logo from '../../assets/logo.svg';
import {getPermissions, hasPermission} from '../../common/permissions.js';
import {auth} from '../../state/auth';
import InviteModal from '../../modals/InviteModal';
import AppBanner from './AppBanner';

const Nav = (props) => <NavLink {...props} activeClassName="active" />;

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
      name: 'Banners',
      route: '/banners',
      icon: 'announcement',
      permission: 'list_all_banner',
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
      name: 'Templates',
      route: '/templates',
      icon: 'file excel',
      permission: 'view_settings',
    },
    {
      name: 'Events',
      route: '/events',
      icon: 'history',
      permission: 'view_event',
    },
    {
      name: 'Jobs',
      route: '/jobs',
      icon: 'server',
      permission: 'list_all_joblog',
    },
    {
      name: 'Users',
      route: '/users',
      icon: 'users',
      permission: 'view_group',
    },
    {
      name: 'Pending Invites',
      route: '/pending-invites',
      icon: 'mail',
      permission: 'list_all_referraltoken',
    },
    {
      name: 'Organizations',
      route: '/organizations',
      icon: 'hospital',
      permission: 'list_all_organization',
    },
    {
      name: 'Model Explorer',
      route: '/explorer',
      icon: 'sitemap',
      permission: 'view_downloadtoken',
    },
    {
      name: 'GraphiQL',
      route: '/graphiql',
      icon: 'code',
      permission: 'view_downloadtoken',
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
    .filter((item) => permissions.includes(item.permission))
    .map((item) => <Item key={item.route} {...item} />);

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

const Header = ({location}) => {
  const history = useHistory();
  const {loading, error, data} = useQuery(MY_PROFILE);
  const profile = data && data.myProfile;

  // Save profile to local storage to be picked up by analytics
  if (profile) localStorage.setItem('profile', JSON.stringify(profile));

  const [loggedIn, setLoggedIn] = useState(profile !== undefined);
  const picUrl = profile && profile.picture ? profile.picture : defaultAvatar;
  const picAlt = profile && profile.username ? profile.username : 'profile';
  if (!loading && profile && !loggedIn && !error) {
    setLoggedIn(true);
  }

  const organizations = profile && profile.organizations;
  var currentOrg;
  try {
    currentOrg = JSON.parse(localStorage.getItem('currentOrganization'));
  } catch (e) {
    currentOrg = null;
  }
  if (!currentOrg && loggedIn) {
    currentOrg = organizations && organizations.edges[0].node;
    localStorage.setItem('currentOrganization', JSON.stringify(currentOrg));
  }

  const {refetch} = useQuery(ALL_STUDIES, {
    fetchPolicy: 'network-only',
    variables: {
      organization: currentOrg && currentOrg.id,
    },
  });

  // Check if the org has changed on the backend and update localstorage
  if (
    organizations &&
    currentOrg &&
    JSON.stringify(
      organizations.edges.find(({node}) => node.id === currentOrg.id).node,
    ) !== JSON.stringify(currentOrg)
  ) {
    localStorage.setItem(
      'currentOrganization',
      JSON.stringify(
        organizations.edges.find(({node}) => node.id === currentOrg.id).node,
      ),
    );
  }

  const defaultLogo =
    'https://raw.githubusercontent.com/kids-first/kf-ui-data-tracker/master/src/assets/logo.svg';

  return (
    <Container fluid>
      <Menu attached size="large">
        <Container>
          {currentOrg ? (
            <Dropdown
              trigger={
                <>
                  <Image
                    avatar
                    src={currentOrg.image || defaultLogo}
                    alt={currentOrg.name}
                  />
                  {currentOrg.name}
                </>
              }
              className="link item"
            >
              <Dropdown.Menu>
                <Dropdown.Header content="Switch Current Organization" />
                {profile &&
                  organizations.edges
                    .filter(({node}) => node.id !== currentOrg.id)
                    .map(({node}) => (
                      <Dropdown.Item
                        onClick={() => {
                          localStorage.setItem(
                            'currentOrganization',
                            JSON.stringify(node),
                          );
                          refetch();
                          history.push('/');
                        }}
                        key={node.id}
                        image={{
                          avatar: true,
                          circular: true,
                          src: node.image || defaultLogo,
                          alt: node.name,
                        }}
                        text={node.name}
                      />
                    ))}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Menu.Item header as={NavLink} to="/" activeClassName="">
              <img src={logo} alt="Kids First logo" />
              Data Tracker
            </Menu.Item>
          )}
          {loggedIn && !location.pathname.includes('/versions/') && (
            <>
              <Menu.Item as={Nav} to="/study" content="Studies" />
              {hasPermission(profile, 'view_settings') && (
                <Menu.Item as={Nav} to="/releases/history">
                  Releases
                  <Label content="beta" color="blue" attached="bottom right" />
                </Menu.Item>
              )}
              <Menu.Menu position="right">
                {hasPermission(profile, 'add_referraltoken') && (
                  <AddUserButton profile={profile} />
                )}
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
      <AppBanner />
    </Container>
  );
};

export default Header;
