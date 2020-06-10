import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {List, Icon, Grid, Accordion} from 'semantic-ui-react';
import {permissionIcon, permissionColor} from '../../../common/enums';

/**
 * Display permission groups
 */
const PermissionGroup = ({groupOptions}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Accordion fluid styled>
      {groupOptions &&
        groupOptions.map(group => (
          <Fragment key={group.key}>
            <Accordion.Title
              active={activeIndex === group.key}
              index={group.key}
              onClick={titleProps =>
                setActiveIndex(activeIndex === group.key ? '' : group.key)
              }
              data-testid="user-group-header"
            >
              <Icon name="dropdown" />
              {group.key}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === group.key}>
              <Grid columns={3}>
                {[0, 1, 2].map(i => (
                  <Grid.Column key={i}>
                    <List>
                      {group.permissions
                        .slice(
                          (group.permissions.length * i) / 3,
                          (group.permissions.length * (i + 1)) / 3,
                        )
                        .map(permission => (
                          <List.Item key={permission.key}>
                            <Icon
                              name={
                                permissionIcon[
                                  permission.key.split('_').slice(-1)[0]
                                ] || 'question'
                              }
                              color={
                                permissionColor[permission.key.split('_')[0]] ||
                                'grey'
                              }
                            />
                            {permission.value}
                          </List.Item>
                        ))}
                    </List>
                  </Grid.Column>
                ))}
              </Grid>
            </Accordion.Content>
          </Fragment>
        ))}
    </Accordion>
  );
};

PermissionGroup.propTypes = {
  /** Array of options to display in a group selection */
  groupOptions: PropTypes.array,
};

PermissionGroup.defaultProps = {
  groupOptions: [],
};

export default PermissionGroup;
