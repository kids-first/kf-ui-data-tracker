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
  NavBarView,
  ProfileView,
  NewStudyView,
  StudyInfoView,
  CavaticaBixView,
  LogsView,
  LogoutView,
  ReleasesView,
  NewStudySelectionView,
  NotFoundView,
} from '../views';
import {
  StudyFilesListView,
  FileDetailView,
  NewDocumentView,
} from '../documents/views';
import {
  ResearchStudyListView,
  NewResearchStudyView,
  ResearchStudyInfoView,
} from '../research/views';
import {
  CavaticaProjectsView,
  ConfigurationView,
  EventsView,
  TokensListView,
} from '../admin/views';
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
      <PrivateRoute path="/study/:kfId(SD_\w{8})/" component={NavBarView} />
      <PrivateRoute
        path="/research-study/:kfId(SD_\w{8})/"
        component={NavBarView}
      />
      <Switch>
        <PrivateRoute exact path="/" component={StudyListView} />
        <AdminRoute exact path="/events" component={EventsView} />
        <PrivateRoute path="/profile" component={ProfileView} />
        <AdminRoute exact path="/configuration" component={ConfigurationView} />
        <AdminRoute
          exact
          path="/study/new-study-selection"
          component={NewStudySelectionView}
        />
        <AdminRoute
          exact
          path="/study/new-research-study"
          component={NewResearchStudyView}
        />
        <AdminRoute
          exact
          path="/study/new-study/info"
          component={NewStudyView}
        />
        <AdminRoute
          exact
          path="/study/new-study/external"
          component={NewStudyView}
        />
        <AdminRoute
          exact
          path="/study/new-study/logistics"
          component={NewStudyView}
        />
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
          path="/research-study/:kfId/basic-info"
          component={ResearchStudyInfoView}
        />
        <PrivateRoute
          path="/research-study/:kfId/cavatica"
          component={CavaticaBixView}
        />
        <PrivateRoute
          exact
          path="/research-study/:kfId/logs"
          component={LogsView}
        />
        <PrivateRoute
          exact
          path="/research-study/:kfId/releases"
          component={ReleasesView}
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
        <PrivateRoute
          exact
          path="/study/:kfId/documents"
          component={StudyFilesListView}
        />
        <PrivateRoute
          path="/study/:kfId/documents/new-document"
          component={NewDocumentView}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/documents/:fileId(SF_\w{8})"
          component={FileDetailView}
        />
        <Route component={NotFoundView} />
      </Switch>
    </div>
    <Footer />
  </Fragment>
);

export default Routes;
