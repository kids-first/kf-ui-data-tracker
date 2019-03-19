// @flow
import React from "react";
import jwtDecode from "jwt-decode";
import { Route, Redirect, withRouter } from "react-router-dom";

type jwtType_user = {
  name: String,
  email: String,
  status: String | any,
  firstName: String,
  lastName: String,
  createdAt: Date,
  lastLogin: Date,
  preferredLanguage: null,
  groups: Array<any>,
  roles: String[],
  permissions: ?(String[])
};

export type jwtType = {
  iat: Date,
  exp: Date,
  sub: String,
  iss: String,
  aud: Array<any>,
  jti: String,
  context: {
    user: jwtType_user
  }
};

export const hasToken = (): true | false | boolean => {
  const token: Function = (): ?string => localStorage.getItem("egoToken");
  if (token == null) {
    return false;
  }

  const user: jwtType_user = jwtDecode(token).context.user;

  return (
    user.status === "Approved" &&
    jwtDecode(token).exp > Math.floor(new Date().getTime() / 1000)
  );
};

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      hasToken() ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);

export default withRouter(PrivateRoute);
