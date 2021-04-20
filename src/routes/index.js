import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RestrictedRoute from './RestrictedRoute';
import {Header} from '../components/Header';
import {Footer} from '../components/Footer';
import {
  LoginView,
  InviteView,
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
  NotFoundView,
  WelcomeView,
} from '../views';
import {
  StudyFilesListView,
  DataValidationView,
  FileDetailView,
  ReviewDetailView,
  ReviewListView,
  StartReviewView,
  UploadView,
  VersionPreviewView,
} from '../documents/views';
import {
  EditBannerView,
  NewBannerView,
  BannersView,
  BucketsView,
  CavaticaProjectsView,
  ConfigurationView,
  EventsView,
  TokensListView,
  UsersView,
  PendingInvitesView,
  LogsView as AdminLogsView,
  LogView,
  ModelExplorerView,
  GraphiQLView,
} from '../admin/views';
import ReleaseRoutes from '../releases/routes';
import TrackedRoute from './TrackedRoute';

const Routes = () => (
  <Fragment>
    <Switch>
      <TrackedRoute path="/login" component={LoginView} />
      <TrackedRoute path="/logout" component={LogoutView} />
      <Route path="/callback" component={CallbackView} />
      <Route path="/auth-error" render={() => <></>} />
      <Route path="/join" component={InviteView} />
      <Route path="/" render={({location}) => <Header location={location} />} />
    </Switch>
    <div className="page">
      <PrivateRoute
        path="/study/:kfId(SD_\w{8})/"
        component={NavBarView}
        disableViewEvent
        scope={['study']}
      />
      <Switch>
        <PrivateRoute exact path="/" component={StudyListView} />
        <PrivateRoute exact path="/study" component={StudyListView} />
        <ReleaseRoutes path="/releases" />
        <TrackedRoute
          path="/welcome"
          component={WelcomeView}
          scope={['welcome']}
        />
        <RestrictedRoute
          exact
          path="/pending-invites"
          component={PendingInvitesView}
          permissions={['list_all_referraltoken']}
        />
        <RestrictedRoute
          exact
          path="/events"
          component={EventsView}
          scope={['admin', 'events']}
          permissions={['view_event']}
        />
        <RestrictedRoute
          exact
          path="/users"
          component={UsersView}
          scope={['admin', 'users']}
          permissions={['list_all_user']}
        />
        <RestrictedRoute
          exact
          path="/jobs"
          component={AdminLogsView}
          scope={['admin', 'jobs']}
          permissions={['list_all_job', 'list_all_joblog']}
        />
        <RestrictedRoute
          exact
          path="/logs/:logId"
          component={LogView}
          scope={['admin', 'logs']}
          permissions={['view_joblog']}
        />
        <PrivateRoute
          path="/profile"
          component={ProfileView}
          scope={['admin', 'profile']}
        />
        <RestrictedRoute
          exact
          path="/configuration"
          component={ConfigurationView}
          scope={['admin', 'configuration']}
          permissions={['view_settings']}
        />
        <RestrictedRoute
          exact
          path="/banners/new-banner"
          component={NewBannerView}
          scope={['admin', 'banners']}
          permissions={['add_banner']}
        />
        <RestrictedRoute
          exact
          path="/banners/edit/:bannerId"
          component={EditBannerView}
          scope={['admin', 'banners']}
          permissions={['change_banner']}
        />
        <RestrictedRoute
          exact
          path="/banners"
          component={BannersView}
          scope={['admin', 'banners']}
          permissions={['list_all_banner']}
        />
        <RestrictedRoute
          exact
          path="/study/new-study/info"
          component={NewStudyView}
          scope={['study', 'new study', 'info']}
          permissions={['add_study']}
        />
        <RestrictedRoute
          exact
          path="/study/new-study/external"
          component={NewStudyView}
          scope={['study', 'new study', 'external']}
          permissions={['add_study']}
        />
        <RestrictedRoute
          exact
          path="/study/new-study/logistics"
          component={NewStudyView}
          scope={['study', 'new study', 'logistics']}
          permissions={['add_study']}
        />
        <PrivateRoute
          path="/study/:kfId/basic-info"
          component={StudyInfoView}
          scope={['study', 'basic info']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId"
          component={StudyFilesListView}
          scope={['study', 'documents']}
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
        <PrivateRoute
          exact
          path="/study/:kfId/reviews"
          component={ReviewListView}
          scope={['study', 'reviews']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/reviews/:reviewId(DR_\w{8})"
          component={ReviewDetailView}
          scope={['study', 'reviews', 'review']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/reviews/:reviewId(DR_\w{8})/validation"
          component={DataValidationView}
          scope={['study', 'reviews', 'review']}
        />
        <RestrictedRoute
          exact
          path="/tokens"
          component={TokensListView}
          scope={['admin', 'tokens']}
          permissions={['view_downloadtoken']}
        />
        <RestrictedRoute
          exact
          path="/buckets"
          component={BucketsView}
          permissions={['view_bucket', 'list_all_bucket']}
        />
        <RestrictedRoute
          exact
          path="/explorer"
          component={ModelExplorerView}
          permissions={['view_downloadtoken']}
        />
        <RestrictedRoute
          exact
          path="/graphiql"
          component={GraphiQLView}
          permissions={['view_downloadtoken']}
        />
        <RestrictedRoute
          exact
          path="/cavatica-projects"
          component={CavaticaProjectsView}
          scope={['admin', 'buckets']}
          permissions={['view_project']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/documents"
          component={StudyFilesListView}
          scope={['study', 'documents']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/start-review"
          component={StartReviewView}
          scope={['study', 'documents', 'review']}
        />
        <PrivateRoute
          path="/study/:kfId/documents/upload"
          component={UploadView}
          scope={['study', 'documents', 'upload']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/documents/:fileId(SF_\w{8})"
          component={FileDetailView}
          scope={['study', 'documents', 'document']}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/documents/:fileId(SF_\w{8})/versions/:versionId(FV_\w{8})/"
          component={VersionPreviewView}
          scope={['study', 'documents', 'document', 'version']}
        />
        <Route component={NotFoundView} />
      </Switch>
    </div>
    <Footer />
  </Fragment>
);

export default Routes;
