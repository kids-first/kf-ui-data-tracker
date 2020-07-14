import React from 'react';
import PropTypes from 'prop-types';
import {List} from 'semantic-ui-react';
import CollaboratorItem from './CollaboratorItem';

/**
 * Display a list of collaborators
 */
const CollaboratorsList = ({
  users,
  showAdminActions,
  addCollaborator,
  removeCollaborator,
}) => {
  const collaborators = users.sort(({node: u1}, {node: u2}) =>
    u1.username.localeCompare(u2.username, 'en-US', {
      caseFirst: 'upper',
      sensitivity: 'case',
      usage: 'sort',
    }),
  );

  return (
    <List relaxed divided>
      {users &&
        users.length > 0 &&
        collaborators.map(({node, role, joinedOn, invitedBy}) => (
          <CollaboratorItem
            key={node.id}
            user={node}
            role={role}
            joinedOn={joinedOn}
            invitedBy={invitedBy}
            showAdminActions={showAdminActions}
            addCollaborator={addCollaborator}
            removeCollaborator={removeCollaborator}
          />
        ))}
    </List>
  );
};

CollaboratorsList.propTypes = {
  /** Array of users */
  users: PropTypes.array,
  /** Whether to show admin actions */
  showAdminActions: PropTypes.bool,
  /** Mutation to remove a collaborator */
  removeCollaborators: PropTypes.func,
};

export default CollaboratorsList;
