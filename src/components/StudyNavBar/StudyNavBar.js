import React from 'react';
import PropTypes from 'prop-types';
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
      tab: 'Data Templates',
      endString: 'templates',
    },
    {
      tab: 'Documents',
      endString: 'documents',
    },
    {
      tab: 'Reviews',
      endString: 'reviews',
    },
    {
      tab: 'Cavatica',
      endString: 'cavatica',
    },
    {
      tab: 'Collaborators',
      endString: 'collaborators',
    },
    {
      tab: 'Logs',
      endString: 'logs',
    },
    {
      tab: 'Releases',
      endString: 'releases',
    },
  ];
  const currentTab = history.location.pathname
    .split('/')
    .filter(e => e !== '')[2];
  return (
    <Menu color="pink" compact secondary pointing>
      {navList.slice(0, isBeta ? 8 : 7).map((item, i) => (
        <Menu.Item
          key={i}
          name={item.tab}
          active={
            currentTab === match.params.kfId
              ? item.endString === 'documents'
              : item.endString.includes(currentTab)
          }
          to={baseHref + item.endString}
          as={NavLink}
        >
          {item.tab}
          {item.endString === 'releases' && isBeta && (
            <Label color="blue" size="mini">
              BETA
            </Label>
          )}
        </Menu.Item>
      ))}
    </Menu>
  );
};

StudyNavBar.propTypes = {
  /** If current user is BETA*/
  isBeta: PropTypes.bool,
  /** Rect-router match object*/
  match: PropTypes.object,
  /** Rect-router history object  */
  history: PropTypes.object,
};

export default withRouter(StudyNavBar);
