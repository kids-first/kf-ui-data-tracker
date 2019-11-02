import React from 'react';
import jwtDecode from 'jwt-decode';
import {Route, Redirect, withRouter} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';

export const isAdmin = () => {
  const token = localStorage.getItem('accessToken');
  if (token == null) {
    return false;
  }

  const decoded = jwtDecode(token);
  if (decoded.exp < Math.floor(new Date().getTime() / 1000)) return false;

  // Extract roles based on whether the token is from auth0
  const roles = decoded.context
    ? decoded.context.user.roles
    : decoded['https://kidsfirstdrc.org/roles'];

  return roles.includes('ADMIN');
};

/**
 * A route that only allows access to admin users, otherwise routes to the
 * index page
 */
const AdminRoute = ({component: Component, path, ...rest}) => {
  let comp = <Component />;

  return (
    <Amplitude
      eventProperties={{
        view: comp.type.WrappedComponent
          ? comp.type.WrappedComponent.name
          : comp.type.name,
        route: path,
      }}
    >
      <Route
        {...rest}
        path={path}
        render={props =>
          isAdmin() ? <Component {...props} /> : <Redirect to="/" />
        }
      />
    </Amplitude>
  );
};

export default withRouter(AdminRoute);
