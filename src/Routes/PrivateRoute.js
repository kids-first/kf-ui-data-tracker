import React from 'react';
import jwtDecode from 'jwt-decode';
import {Redirect, withRouter} from 'react-router-dom';
import TrackedRoute from './TrackedRoute';

export const hasToken = () => {
  const token = localStorage.getItem('accessToken');
  if (token == null) {
    return false;
  }
  return jwtDecode(token || '').exp > Math.floor(new Date().getTime() / 1000);
};

const PrivateRoute = ({component: Component, ...rest}) => (
  <TrackedRoute
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
