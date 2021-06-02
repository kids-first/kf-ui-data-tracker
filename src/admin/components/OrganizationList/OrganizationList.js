import React from 'react';
import {List} from 'semantic-ui-react';
import OrganizationItem from './OrganizationItem';

const OrganizationList = ({organizations, updateOrganization}) => {
  return (
    <List relaxed divided>
      {organizations &&
        organizations.length > 0 &&
        organizations.map(({node}) => (
          <OrganizationItem
            key={node.id}
            organization={node}
            updateOrganization={updateOrganization}
          />
        ))}
    </List>
  );
};

export default OrganizationList;
