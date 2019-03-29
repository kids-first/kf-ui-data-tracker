import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';
/**
 * Displays tab bar button by taking an array of tab names
 */

const NavBarButton = ({to, children}) => {
  return (
    <NavLink
      className="SecondaryNav--Button sm:px-6"
      activeClassName="SecondaryNav--Button-active"
      to={to}
    >
      {children}
    </NavLink>
  );
};

NavBarButton.propTypes = {
  /** Any additional classes to be applied to the nav bar button*/
  className: PropTypes.string,
  /** Children elements. */
  children: PropTypes.node.isRequired,
  /** Redirect URL. */
  to: PropTypes.string,
};

NavBarButton.defaultProps = {
  className: null,
  children: null,
  to: null,
};

export default NavBarButton;
