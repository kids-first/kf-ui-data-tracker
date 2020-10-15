import React from 'react';
import {Route, Switch} from 'react-router-dom';
import RestrictedRoute from '../routes/RestrictedRoute';
import {
  HomeView,
  NavigationView,
  NewReleaseView,
  NewServiceView,
  ServicesListView,
} from './views';

const Routes = () => (
  <>
    <Route path="/releases" render={() => <NavigationView />} />
    <Switch>
      <Route exact path="/releases/history" render={() => <HomeView />} />
      <Route
        exact
        path="/releases/services"
        render={() => <ServicesListView />}
      />
      <RestrictedRoute
        exact
        path="/releases/services/new-service"
        component={NewServiceView}
        scope={['services', 'new']}
        permissions={['view_settings']}
      />
      <RestrictedRoute
        exact
        path="/releases/new-release"
        component={NewReleaseView}
        scope={['releases', 'new']}
        permissions={['view_settings']}
      />
    </Switch>
  </>
);

export default Routes;
