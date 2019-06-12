import React from 'react';
import jwtDecode from 'jwt-decode';
import {Route, Redirect, withRouter} from 'react-router-dom';

export const hasToken = () => {
  const token =
    localStorage.getItem('egoToken') || localStorage.getItem('accessToken');
  if (token == null) {
    return false;
  }
  return jwtDecode(token).exp > Math.floor(new Date().getTime() / 1000);
};

const PrivateRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props =>
      hasToken() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: {from: window.location.pathname},
          }}
        />
      )
    }
  />
);

export default withRouter(PrivateRoute);
