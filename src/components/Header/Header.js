import React, {useState} from 'react';
import {graphql} from 'react-apollo';
import {NavLink} from 'react-router-dom';
import {MY_PROFILE} from '../../state/queries';
import {Container, Dropdown, Icon, Image, Menu} from 'semantic-ui-react';

import logo from '../../assets/logo.svg';

const Nav = props => <NavLink exact {...props} activeClassName="active" />;

const Header = ({data: {loading, error, myProfile: profile}}) => {
  const [loggedIn, setLoggedIn] = useState(profile !== undefined);
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
              <Dropdown
                trigger={
                  <>
                    <Image avatar src={profile.picture} />
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
                    to="/login"
                    onClick={() => {
                      setLoggedIn(false);
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('idToken');
                      localStorage.removeItem('egoToken');
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
