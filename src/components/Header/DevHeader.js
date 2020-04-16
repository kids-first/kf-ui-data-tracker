import React, {useState} from 'react';
import {useQuery} from '@apollo/react-hooks';
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
  const [groupsStatus, setGroupsStatus] = useState('');
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

  const updateGroups = (data) => {
    setGroupsLoading(true);
    const q = data.value.join(',');
    fetch(`${KF_STUDY_API}/__dev/change-groups/?groups=${q}`, {
      method: 'POST',
    }).then(resp => {
      setGroupsLoading(false);
      resp.json().then(data => setGroupsStatus(data.status || 'error'));
      setTimeout(() => {
        setGroupsStatus('');
      }, 2000);
    });
  };

  const resetDatabase = () => {
    setDatabaseLoading(true);
    fetch(`${KF_STUDY_API}/__dev/reset-db/`, {method: 'POST'}).then(resp => {
      setDatabaseLoading(false);
      resp.json().then(data => setDatabaseStatus(data.status || 'error'));
      setTimeout(() => {
        setDatabaseStatus('');
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
            trigger={<span>H@X0r Mode</span>}
            content={
              <Image src="https://media.giphy.com/media/Hcw7rjsIsHcmk/giphy.gif" />
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
          {groupsStatus !== '' && (
            <Menu.Item>
              <Icon
                name={groupsStatus === 'done' ? 'check' : 'delete'}
                loading={databaseLoading}
              />
            </Menu.Item>
          )}
          <Dropdown
            item
            multiple
            text="Change Groups"
            disabled={groupsLoading}
            loading={groupsLoading}
            value={selectedGroups}
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
