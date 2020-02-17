import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {
  LoginView,
  StudyListView,
  CallbackView,
  ConfigurationView,
  NavBarView,
  TokensListView,
  CavaticaProjectsView,
  ProfileView,
  NewStudyView,
  StudyInfoView,
  EventsView,
  CavaticaBixView,
  LogsView,
  LogoutView,
  ReleasesView,
  NewStudySelectionView,
} from '../views';
import DocumentRoutes from '../documents/routes';
import {ResearchStudyListView} from '../research/views';
import TrackedRoute from './TrackedRoute';

const Routes = () => (
  <Fragment>
    <Switch>
      <TrackedRoute path="/login" component={LoginView} />
      <TrackedRoute path="/logout" component={LogoutView} />
      <Route path="/callback" component={CallbackView} />
      <Route path="/" render={() => <Header />} />
    </Switch>
    <div className="page">
      <PrivateRoute path="/profile" component={ProfileView} />
      <PrivateRoute path="/study/:kfId(SD_\w{8})/" component={NavBarView} />
      <AdminRoute path="/study/new-study" component={NewStudyView} />
      <AdminRoute
        path="/study/new-study-selection"
        component={NewStudySelectionView}
      />
      <Switch>
        <PrivateRoute exact path="/" component={StudyListView} />
        <PrivateRoute
          exact
          path="/research-studies"
          component={ResearchStudyListView}
        />
        <PrivateRoute
          path="/study/:kfId/basic-info"
          component={StudyInfoView}
        />
        <PrivateRoute
          path="/study/:kfId/cavatica"
          component={CavaticaBixView}
        />
        <PrivateRoute exact path="/study/:kfId/logs" component={LogsView} />
        <PrivateRoute
          exact
          path="/study/:kfId/releases"
          component={ReleasesView}
        />
        <AdminRoute exact path="/tokens" component={TokensListView} />
        <AdminRoute
          exact
          path="/cavatica-projects"
          component={CavaticaProjectsView}
        />
        <AdminRoute exact path="/events" component={EventsView} />
        <AdminRoute exact path="/configuration" component={ConfigurationView} />
        <DocumentRoutes />
      </Switch>
    </div>
    <Footer />
  </Fragment>
);

export default Routes;
