import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import {Header} from 'kf-uikit';
import {
  AnnotationView,
  LoginView,
  StudyListView,
  StudyFilesListView,
  CallbackView,
  NavBarView,
} from '../views';

const Routes = () => (
  <Router>
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
          />
        )}
      />
      <Route path="/login" component={LoginView} />
      <Route path="/callback" component={CallbackView} />
      <div className="BodyContent">
        <PrivateRoute exact path="/" component={StudyListView} />
        <PrivateRoute path="/study/:kfId/" component={NavBarView} />
        <PrivateRoute
          exact
          path="/study/:kfId/files"
          component={StudyFilesListView}
        />
        <PrivateRoute
          path="/study/:kfId/files/:fileId"
          component={AnnotationView}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/basicInfo"
          component={StudyFilesListView}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/dashboard"
          component={StudyFilesListView}
        />
        <PrivateRoute
          exact
          path="/study/:kfId/collaborators"
          component={StudyFilesListView}
        />
      </div>
    </Fragment>
  </Router>
);

export default Routes;
