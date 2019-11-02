import React from 'react';
import jwtDecode from 'jwt-decode';
import {Route, Redirect, withRouter} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';

export const hasToken = () => {
  const token = localStorage.getItem('accessToken');
  if (token == null) {
    return false;
  }
  return jwtDecode(token).exp > Math.floor(new Date().getTime() / 1000);
};

const PrivateRoute = ({component: Component, ...rest}) => {
  // note: unsure if this mounts the
  let comp = <Component />;

  return (
    <Amplitude
      eventProperties={{
        view: comp.type.WrappedComponent
          ? comp.type.WrappedComponent.name
          : comp.type.name,
        route: rest.path,
      }}
    >
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
    </Amplitude>
  );
};

export default withRouter(PrivateRoute);
