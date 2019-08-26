import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import {Header} from '../components/Header';
import {
  NewDocumentView,
  LoginView,
  StudyListView,
  StudyFilesListView,
  CallbackView,
  NavBarView,
  EmptyView,
  TokensListView,
  CavaticaProjectsView,
  FileDetailView,
  ProfileView,
  NewStudyView,
  StudyInfoView,
} from '../views';
const Routes = () => (
  <Fragment>
    <Switch>
      <Route path="/login" component={LoginView} />
      <Route path="/callback" component={CallbackView} />
      <Route path="/" render={() => <Header />} />
    </Switch>
    <PrivateRoute path="/profile" component={ProfileView} />
    <PrivateRoute path="/study/:kfId(SD_\w{8})/" component={NavBarView} />
    <AdminRoute exact path="/study/new-study" component={NewStudyView} />
    <Switch>
      <PrivateRoute exact path="/" component={StudyListView} />
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
        path="/study/:kfId/documents/:fileId"
        component={FileDetailView}
      />
      <PrivateRoute
        exact
        path="/study/:kfId/basicInfo"
        component={StudyInfoView}
      />
      <PrivateRoute exact path="/study/:kfId/dashboard" component={EmptyView} />
      <PrivateRoute
        exact
        path="/study/:kfId/collaborators"
        component={EmptyView}
      />
      <AdminRoute exact path="/tokens" component={TokensListView} />
      <AdminRoute
        exact
        path="/cavatica-projects"
        component={CavaticaProjectsView}
      />
    </Switch>
  </Fragment>
);

export default Routes;
