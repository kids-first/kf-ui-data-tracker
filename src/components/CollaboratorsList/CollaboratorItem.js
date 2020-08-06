import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Dropdown,
  Icon,
  Image,
  List,
  Popup,
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {longDate} from '../../common/dateUtils';
import defaultAvatar from '../../assets/defaultAvatar.png';
import {collaboratorRoles} from '../../common/enums';

const Actions = ({user, removeCollaborator}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button.Group fluid size="mini">
      <Popup
        trigger={
          <Button
            basic
            negative
            labelPosition="left"
            content="Remove"
            data-testid="remove-button"
            icon={<Icon name="remove" />}
          />
        }
        header="Remove Collaborator?"
        content={
          <>
            This user will no longer be associated with this study
            <Divider />
            <Button
              data-testid="remove-confirm"
              negative
              fluid
              labelPosition="left"
              icon={<Icon name="remove" />}
              content="Remove"
              loading={loading}
              disabled={loading}
              onClick={e => {
                setLoading(true);
                removeCollaborator({variables: {user: user.id}});
              }}
            />
          </>
        }
        on="click"
        position="top right"
      />
    </Button.Group>
  );
};

const RoleDropdown = ({role, user, addCollaborator}) => {
  const [loading, setLoading] = useState(false);
  const onChange = (ev, {value}) => {
    setLoading(true);
    addCollaborator({
      variables: {user: user.id, role: value},
    }).then(() => setLoading(false));
  };

  const roleOptions = Object.values(collaboratorRoles).map(role => ({
    key: role.key,
    value: role.key,
    text: role.name,
  }));
  return (
    <Dropdown
      value={role}
      disabled={loading}
      loading={loading}
      options={roleOptions}
      onChange={onChange}
    />
  );
};

/**
 * Display a list of collaborators
 */
const CollaboratorItem = ({
  user,
  role,
  joinedOn,
  invitedBy,
  showAdminActions,
  addCollaborator,
  removeCollaborator,
}) => {
  return (
    <List.Item key={user.id} data-testid="user-item">
      <Image
        avatar
        src={user.picture || defaultAvatar}
        alt={user.displayName}
      />
      <List.Content>
        <List.Header>
          {user.displayName}
          {user.email && <small> - {user.email}</small>}
        </List.Header>
        <List.Description>
          <List bulleted horizontal>
            <List.Item>
              {addCollaborator ? (
                <RoleDropdown
                  addCollaborator={addCollaborator}
                  role={role}
                  user={user}
                />
              ) : role in collaboratorRoles ? (
                collaboratorRoles[role].name
              ) : (
                'Unkown Role'
              )}
            </List.Item>
            <List.Item>
              Joined{' '}
              <TimeAgo
                live={false}
                date={joinedOn}
                title={longDate(joinedOn)}
              />
            </List.Item>
            <List.Item>
              Added by {invitedBy ? invitedBy.displayName : 'Unknown user'}
            </List.Item>
          </List>
        </List.Description>
      </List.Content>
      {showAdminActions && (
        <List.Content floated="right">
          <Actions user={user} removeCollaborator={removeCollaborator} />
        </List.Content>
      )}
    </List.Item>
  );
};

CollaboratorItem.propTypes = {
  /** The user to display */
  user: PropTypes.object,
  /** Whether to show admin actions */
  showAdminActions: PropTypes.bool,
};

export default CollaboratorItem;
