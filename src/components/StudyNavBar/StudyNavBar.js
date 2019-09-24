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
      endString: 'basic-info/info',
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
      tab: 'Cavatica',
      endString: 'cavatica',
    },
    {
      tab: 'Logs',
      endString: 'logs',
    },
  ];
  return (
    <Menu color="pink" secondary pointing>
      {navList.map((item, i) => (
        <Menu.Item
          key={i}
          name={item.tab}
          active={history.location.pathname.includes(
            item.endString.split('/')[0],
          )}
          to={baseHref + item.endString}
          as={NavLink}
        >
          {item.tab}
          {item.endString === 'basic-info/info' && isBeta && (
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
