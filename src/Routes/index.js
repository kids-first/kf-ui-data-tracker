import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import {Header} from 'kf-uikit';
import {
  AnnotationView,
  LoginView,
  StudyListView,
  FilesView,
  CallbackView,
  NavBarView,
} from '../views';

const Routes = () => (
  <Router>
    <div>
      <Route
        path="/"
        render={({history}) => (
          <Header
            logo={{
              onLogoClick: () => {
                history.push(`/`);
              },
            }}
          />
        )}
      />
      <Route path="/login" component={LoginView} />
      <Route path="/callback" component={CallbackView} />
      <PrivateRoute exact path="/" component={StudyListView} />
      <PrivateRoute path="/study/:kfId/" component={NavBarView} />
      <PrivateRoute exact path="/study/:kfId/files" component={FilesView} />
      <PrivateRoute
        path="/study/:kfId/files/:fileId"
        component={AnnotationView}
      />
      <PrivateRoute exact path="/study/:kfId/basicInfo" component={FilesView} />
      <PrivateRoute exact path="/study/:kfId/dashboard" component={FilesView} />
      <PrivateRoute
        exact
        path="/study/:kfId/collaborators"
        component={FilesView}
      />
    </div>
  </Router>
);

export default Routes;
