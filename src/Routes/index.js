import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import {Header} from '../components/Header';
import {
  LoginView,
  StudyListView,
  CallbackView,
  NavBarView,
  EmptyView,
  TokensListView,
  CavaticaProjectsView,
  ProfileView,
  NewStudyView,
  StudyInfoView,
  EventsView,
  CavaticaBixView,
  LogsView,
  LogoutView,
} from '../views';
import DocumentRoutes from '../documents/routes';
import TrackedRoute from './TrackedRoute';

const Routes = () => (
  <Fragment>
    <Switch>
      <TrackedRoute path="/login" component={LoginView} />
      <TrackedRoute path="/logout" component={LogoutView} />
      <Route path="/callback" component={CallbackView} />
      <Route path="/" render={() => <Header />} />
    </Switch>
    <PrivateRoute
      path="/study/:kfId(SD_\w{8})/"
      logMount={false}
      component={NavBarView}
    />
    <Switch>
      <AdminRoute path="/study/new-study" component={NewStudyView} />
      <PrivateRoute path="/profile" component={ProfileView} />
      <PrivateRoute exact path="/" component={StudyListView} />
      <PrivateRoute path="/study/:kfId/basic-info" component={StudyInfoView} />
      <PrivateRoute exact path="/study/:kfId/dashboard" component={EmptyView} />
      <PrivateRoute path="/study/:kfId/cavatica" component={CavaticaBixView} />
      <PrivateRoute exact path="/study/:kfId/logs" component={LogsView} />
      <AdminRoute
        exact
        path="/tokens"
        component={TokensListView}
        eventProperties={{view: 'TokensListView'}}
      />
      <AdminRoute
        exact
        path="/cavatica-projects"
        component={CavaticaProjectsView}
      />
      <AdminRoute exact path="/events" component={EventsView} />
      <DocumentRoutes />
    </Switch>
  </Fragment>
);

export default Routes;
