import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from './authentication';

import {
  LoginView,
  HomeView,
  InvestigatorListView,
  FileUploadView,
  FileListView,
} from './views';

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/login" component={LoginView} />
      <PrivateRoute exact path="/" component={HomeView} />
      <PrivateRoute
        path="/investigator-list"
        component={InvestigatorListView}
      />
      <PrivateRoute path="/file-upload" component={FileUploadView} />
      <PrivateRoute path="/file-list" component={FileListView} />
    </Switch>
  </Router>
);

export default Routes;
