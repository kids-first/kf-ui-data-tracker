import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'semantic-ui-react';
import CollaboratorItem from './CollaboratorItem';

/**
 * Display a list of collaborators
 */
const CollaboratorsList = ({users, showAdminActions, removeCollaborator}) => (
  <List relaxed divided>
    {users &&
      users.length > 0 &&
      users
        .sort(({node: u1}, {node: u2}) =>
          u1.username.localeCompare(u2.username, 'en-US', {
            caseFirst: 'upper',
            sensitivity: 'case',
            usage: 'sort',
          }),
        )
        .map(({node}) => (
          <CollaboratorItem
            key={node.id}
            user={node}
            showAdminActions={showAdminActions}
            removeCollaborator={removeCollaborator}
          />
        ))}
  </List>
);

CollaboratorsList.propTypes = {
  /** Array of users */
  users: PropTypes.array,
  /** Whether to show admin actions */
  showAdminActions: PropTypes.bool,
};

export default CollaboratorsList;
