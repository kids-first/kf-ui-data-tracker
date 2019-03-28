import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {withRouter} from 'react-router-dom';
import NavBarButton from './NavBarButton';
/**
 * Displays nav bar
 */

const NavBar = ({className, match}) => {
  let navBarClass = classes('SecondaryNav', className);

  return (
    <div className={navBarClass}>
      <NavBarButton to={`/study/${match.params.kfId}/basicInfo`}>
        Basic Info
      </NavBarButton>
      <NavBarButton to={`/study/${match.params.kfId}/dashboard`}>
        Dashboard
      </NavBarButton>
      <NavBarButton to={`/study/${match.params.kfId}/files`}>
        Files
      </NavBarButton>
      <NavBarButton to={`/study/${match.params.kfId}/collaborators`}>
        Collaborators
      </NavBarButton>
    </div>
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
