import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import RestrictedRoute from '../routes/RestrictedRoute';
import {HomeView} from './views';

const Routes = () => (
  <Switch>
    <Route path="/" render={() => <HomeView />} />
    <RestrictedRoute
      exact
      path="/tokens"
      component={HomeView}
      scope={['releases', 'home']}
      permissions={['view_downloadtoken']}
    />
  </Switch>
);

export default Routes;
