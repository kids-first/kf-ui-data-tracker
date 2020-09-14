import React from 'react';
import {Route, Switch} from 'react-router-dom';
import RestrictedRoute from '../routes/RestrictedRoute';
import {HomeView, NewReleaseView} from './views';

const Routes = () => (
  <Switch>
    <Route exact path="/releases" render={() => <HomeView />} />
    <RestrictedRoute
      exact
      path="/releases/new-release"
      component={NewReleaseView}
      scope={['releases', 'new']}
      permissions={['view_settings']}
    />
  </Switch>
);

export default Routes;
