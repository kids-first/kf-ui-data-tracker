import React from 'react';
import PropTypes from 'prop-types';
import {withRouter, NavLink} from 'react-router-dom';
import {Menu} from 'semantic-ui-react';

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
