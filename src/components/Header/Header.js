import React, {useState} from 'react';
import {graphql} from 'react-apollo';
import {NavLink} from 'react-router-dom';
import {MY_PROFILE} from '../../state/queries';
import {Container, Dropdown, Icon, Image, Menu} from 'semantic-ui-react';
import defaultAvatar from '../../assets/defaultAvatar.png';
import logo from '../../assets/logo.svg';

const Nav = props => <NavLink exact {...props} activeClassName="active" />;

const Header = ({data: {loading, error, myProfile: profile}}) => {
  const [loggedIn, setLoggedIn] = useState(profile !== undefined);
  const picUrl = profile && profile.picture ? profile.picture : defaultAvatar;
  const picAlt = profile && profile.username ? profile.username : 'profile';
  if (!loading && profile && !loggedIn) {
    setLoggedIn(true);
  }

  return (
    <Menu attached="top" size="large">
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
              {profile.roles.includes('ADMIN') && (
                <Dropdown trigger={'Admin'} className="link item">
                  <Dropdown.Menu>
                    <Dropdown.Item as={Nav} to="/tokens">
                      <Icon name="key" />
                      Developer Tokens
                    </Dropdown.Item>
                    <Dropdown.Item as={Nav} to="/cavatica-projects">
                      <Icon name="folder open" />
                      Cavatica Projects
                    </Dropdown.Item>
                    <Dropdown.Item as={Nav} to="/events">
                      <Icon name="history" />
                      Event Log
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
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
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('idToken');
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

export default graphql(MY_PROFILE)(Header);
