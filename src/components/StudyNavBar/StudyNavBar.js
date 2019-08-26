import React from 'react';
import {withRouter, NavLink} from 'react-router-dom';
import {Menu, Label} from 'semantic-ui-react';

/**
 * Menu for navigating within a study
 */
const StudyNavBar = ({match, history, isBeta}) => {
  const baseHref = `/study/${match.params.kfId}/`;
  const navList = [
    {
      tab: 'Basic Info',
      endString: 'basicInfo',
    },
    {
      tab: 'Dashboard',
      endString: 'dashboard',
    },
    {
      tab: 'Documents',
      endString: 'documents',
    },
    {
      tab: 'Collaborators',
      endString: 'collaborators',
    },
  ];
  return (
    <Menu color="pink" secondary pointing>
      {navList.map((item, i) => (
        <Menu.Item
          key={i}
          name={item.tab}
          active={match.url.includes(item.endString)}
          to={baseHref + item.endString}
          as={NavLink}
        >
          {item.tab}
          {item.endString === 'basicInfo' && isBeta && (
            <Label color="blue" size="mini">
              BETA
            </Label>
          )}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default withRouter(StudyNavBar);
