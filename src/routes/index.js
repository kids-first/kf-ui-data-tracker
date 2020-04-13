import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import RestrictedRoute from './RestrictedRoute';
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
  CollaboratorsView,
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
  BucketsView,
  CavaticaProjectsView,
  ConfigurationView,
  EventsView,
  TokensListView,
  UsersView,
} from '../admin/views';
import TrackedRoute from './TrackedRoute';

const Routes = () => (
  <Fragment>
    <Switch>
      <TrackedRoute path="/login" component={LoginView} />
      <TrackedRoute path="/logout" component={LogoutView} />
      <Route path="/callback" component={CallbackView} />
      <Route path="/auth-error" render={() => <></>} />
      <Route path="/" render={() => <Header />} />
    </Switch>
    <div className="page">
      <PrivateRoute
        path="/study/:kfId(SD_\w{8})/"
        component={NavBarView}
        disableViewEvent
        scope={['study']}
      />
      <PrivateRoute
        path="/research-study/:kfId(SD_\w{8})/"
        component={NavBarView}
        disableViewEvent
        scope={['study']}
      />
      <Switch>
        <PrivateRoute exact path="/" component={StudyListView} />
        <AdminRoute
          exact
          path="/events"
          component={EventsView}
          scope={['admin', 'events']}
        />
        <RestrictedRoute
          exact
          path="/users"
          component={UsersView}
          scope={['admin', 'users']}
          permissions={['view_user']}
        />
        <PrivateRoute
          path="/profile"
          component={ProfileView}
          scope={['admin', 'profile']}
        />
        <AdminRoute
          exact
          path="/configuration"
          component={ConfigurationView}
          scope={['admin', 'configuration']}
        />
        <AdminRoute
          exact
          path="/study/new-study-selection"
          component={NewStudySelectionView}
          scope={['study', 'new study selection']}
        />
        <AdminRoute
          exact
          path="/study/new-research-study"
          component={NewResearchStudyView}
          scope={['study', 'new research study']}
        />
        <AdminRoute
          exact
          path="/study/new-study/info"
          component={NewStudyView}
          scope={['study', 'new study', 'info']}
        />
        <AdminRoute
          exact
          path="/study/new-study/external"
          component={NewStudyView}
          scope={['study', 'new study', 'external']}
        />
        <AdminRoute
          exact
          path="/study/new-study/logistics"
          component={NewStudyView}
          scope={['study', 'new study', 'logistics']}
        />
        <PrivateRoute
          exact
          path="/research-studies"
          component={ResearchStudyListView}
          scope={['research studies']}
        />
        <PrivateRoute
          path="/study/:kfId/basic-info"
          component={StudyInfoView}
          scope={['study', 'basic info']}
        />
        <PrivateRoute
          path="/research-study/:kfId/basic-info"
          component={ResearchStudyInfoView}
          scope={['study', 'basic info']}
        />
        <PrivateRoute
          path="/research-study/:kfId/cavatica"
          component={CavaticaBixView}
          scope={['study', 'cavatica']}
        />
        <PrivateRoute
          exact
          path="/research-study/:kfId/logs"
          component={LogsView}
          scope={['study', 'logs']}
        />
        <PrivateRoute
          exact
          path="/research-study/:kfId/releases"
          component={ReleasesView}
          scope={['study', 'releases']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/collaborators"
          component={CollaboratorsView}
        />
        <PrivateRoute
          path="/study/:kfId/cavatica"
          component={CavaticaBixView}
          scope={['study', 'cavatica']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/logs"
          component={LogsView}
          scope={['study', 'logs']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/releases"
          component={ReleasesView}
          scope={['study', 'releases']}
        />
        <AdminRoute
          exact
          path="/tokens"
          component={TokensListView}
          scope={['admin', 'tokens']}
        />
        <AdminRoute exact path="/buckets" component={BucketsView} />
        <AdminRoute
          exact
          path="/cavatica-projects"
          component={CavaticaProjectsView}
          scope={['admin', 'buckets']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/documents"
          component={StudyFilesListView}
          scope={['study', 'documents']}
        />
        <PrivateRoute
          path="/study/:kfId/documents/new-document"
          component={NewDocumentView}
          scope={['study', 'documents', 'new document']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/documents/:fileId(SF_\w{8})"
          component={FileDetailView}
          scope={['study', 'documents', 'document']}
        />
        <Route component={NotFoundView} />
      </Switch>
    </div>
    <Footer />
  </Fragment>
);

export default Routes;
