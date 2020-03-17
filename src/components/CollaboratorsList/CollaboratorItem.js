import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Icon, Image, List, Popup} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import {longDate} from '../../common/dateUtils';
import defaultAvatar from '../../assets/defaultAvatar.png';

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

/**
 * Display a list of collaborators
 */
const CollaboratorItem = ({user, showAdminActions, removeCollaborator}) => {
  return (
    <List.Item key={user.id} data-testid="user-item">
      <Image avatar src={user.picture || defaultAvatar} />
      <List.Content>
        <List.Header>
          {user.username}
          {user.email && <small> - {user.email}</small>}
        </List.Header>
        <List.Description>
          {user.roles.length > 0 ? user.roles.join(', ') : 'Unknown role'}
        </List.Description>
      </List.Content>
      {showAdminActions && (
        <List.Content floated="right">
          <Actions user={user} removeCollaborator={removeCollaborator} />
        </List.Content>
      )}
      {user.dateJoined && (
        <List.Content floated="right">
          Joined{' '}
          <TimeAgo
            live={false}
            date={user.dateJoined}
            title={longDate(user.dateJoined)}
          />
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
