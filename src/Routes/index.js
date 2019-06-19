import React, {Fragment} from 'react';
import {Route, Switch} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import Header from '../components/Header';
import {
  NewDocumentView,
  LoginView,
  StudyListView,
  StudyFilesListView,
  CallbackView,
  NavBarView,
  EmptyView,
  TokensListView,
  FileDetailView,
  ProfileView,
} from '../views';
const Routes = () => (
  <Fragment>
    <Route
      path="/"
      render={({history}) => (
        <Header
          logo={{
            onLogoClick: () => {
              history.push(`/`);
            },
          }}
          buttons={[
            (localStorage.getItem('accessToken') !== null ||
              localStorage.getItem('egoToken') !== null) && [
              <ProfileDropdown history={history} key={0} />,
            ],
          ]}
        />
      )}
    />
    <Route path="/login" component={LoginView} />
    <Route path="/callback" component={CallbackView} />
    <PrivateRoute path="/profile" component={ProfileView} />
    <PrivateRoute path="/study/:kfId/" component={NavBarView} />
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
      <PrivateRoute exact path="/study/:kfId/basicInfo" component={EmptyView} />
      <PrivateRoute exact path="/study/:kfId/dashboard" component={EmptyView} />
      <PrivateRoute
        exact
        path="/study/:kfId/collaborators"
        component={EmptyView}
      />
      <AdminRoute exact path="/tokens" component={TokensListView} />
    </Switch>
  </Fragment>
);

export default Routes;
