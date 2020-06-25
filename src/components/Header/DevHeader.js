import React, {useState} from 'react';
import {useQuery} from '@apollo/client';
import {ALL_GROUPS, MY_PROFILE, STATUS} from '../../state/queries';
import {DEV_BAR, KF_STUDY_API} from '../../common/globals';
import {Container, Dropdown, Icon, Image, Menu, Popup} from 'semantic-ui-react';

const DevHeader = () => {
  const {data: statusData} = useQuery(STATUS);
  const status = statusData && statusData.status;

  const {data: profileData} = useQuery(MY_PROFILE);
  const myProfile = profileData && profileData.myProfile;

  const {data: groupsData} = useQuery(ALL_GROUPS);

  const [groupsLoading, setGroupsLoading] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState(null);
  const [databaseLoading, setDatabaseLoading] = useState(false);
  const [databaseStatus, setDatabaseStatus] = useState('');

  if (myProfile && selectedGroups === null) {
    const groups = myProfile.groups.edges.map(({node}) => node.name);
    setSelectedGroups(groups);
  }

  var groupOptions =
    groupsData &&
    groupsData.allGroups.edges.map(({node}) => ({
      key: node.name,
      text: node.name,
      value: node.name,
    }));

  // Inject groups if we are running with the dev bar explicitly so as to avoid
  // allGroups queries which are protected
  if (!groupOptions && DEV_BAR) {
    groupOptions = [
      'Administrators',
      'Developers',
      'Investigators',
      'Bioinformatics',
      'Services',
    ].map(name => ({
      key: name,
      text: name,
      value: name,
    }));
  }

  const updateGroups = data => {
    setGroupsLoading(true);
    const q = data.value.join(',');
    fetch(`${KF_STUDY_API}/__dev/change-groups/?groups=${q}`, {
      method: 'POST',
    }).then(resp => {
      resp.json().then(data => {
        if (data.status === 'done') window.location.reload();
      });
    });
  };

  const resetDatabase = () => {
    setDatabaseLoading(true);
    fetch(`${KF_STUDY_API}/__dev/reset-db/`, {method: 'POST'}).then(resp => {
      resp.json().then(data => {
        setDatabaseStatus(data.status || 'error');
        setDatabaseLoading(false);
      });
      setTimeout(() => {
        setDatabaseStatus('');
        window.location.reload();
      }, 2000);
    });
  };

  if (
    !DEV_BAR &&
    (!status || !myProfile || !status.settings.developmentEndpoints)
  )
    return <></>;

  return (
    <Menu inverted attached size="tiny">
      <Container>
        <Menu.Item header style={{color: '#00dd00'}}>
          <Popup
            inverted
            flowing
            on="hover"
            open={
              databaseLoading || databaseStatus || groupsLoading
                ? true
                : undefined
            }
            trigger={<span>H@X0r Mode</span>}
            content={
              <>
                <p>
                  <Image src="https://media.giphy.com/media/Hcw7rjsIsHcmk/giphy.gif" />
                </p>
                <p style={{color: '#00dd00'}}>
                  Shhhhh, keyboard cat is working...
                </p>
              </>
            }
          />
        </Menu.Item>

        <Menu.Menu position="right">
          <Menu.Item onClick={databaseLoading ? null : resetDatabase}>
            <Icon
              name={
                databaseStatus
                  ? databaseStatus === 'done'
                    ? 'check'
                    : 'delete'
                  : 'refresh'
              }
              loading={databaseLoading}
            />
            Reset Database
          </Menu.Item>
          <Dropdown
            item
            multiple
            text="Change Groups"
            disabled={groupsLoading}
            loading={groupsLoading}
            value={selectedGroups || []}
            options={groupOptions}
            onChange={(event, data) => {
              setSelectedGroups(data.value);
              updateGroups(data);
            }}
          />
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default DevHeader;
