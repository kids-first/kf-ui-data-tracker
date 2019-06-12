import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter, NavLink} from 'react-router-dom';
import {SecondaryNav} from 'kf-uikit';
/**
 * Displays nav bar
 */
const NavBar = ({className, match, history}) => {
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
    <SecondaryNav
      className="border-none cell-12"
      buttons={navList.map((i, index) => (
        <li
          className={classes('SecondaryNav--link', {
            'SecondaryNav--link-active': history.location.pathname.includes(
              i.endString,
            ),
          })}
          key={i.endString}
        >
          <NavLink to={baseHref + i.endString}>{i.tab}</NavLink>
        </li>
      ))}
    />
  );
};

NavBar.propTypes = {
  /** Any additional classes to be applied to the nav bar*/
  className: PropTypes.string,
};

NavBar.defaultProps = {
  className: null,
};

export default withRouter(NavBar);
