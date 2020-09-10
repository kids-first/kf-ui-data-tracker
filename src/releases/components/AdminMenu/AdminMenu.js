import React from 'react';
import {Icon, Menu} from 'semantic-ui-react';

const AdminMenu = () => (
  <Menu vertical>
    <Menu.Item>
      <Menu.Header>Admin Panel</Menu.Header>
      <Menu.Menu>
        <Menu.Item>
          <Icon name="tag" />
          New Release
        </Menu.Item>
        <Menu.Item name="about">
          <Icon name="settings" />
          New Service
        </Menu.Item>
        <Menu.Item name="about">Service Status</Menu.Item>
      </Menu.Menu>
    </Menu.Item>
  </Menu>
);

export default AdminMenu;
