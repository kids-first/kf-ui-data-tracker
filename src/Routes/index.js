import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import { LoginView, StudyListView, FileUploadView, FileListView } from '../views';

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/login" component={LoginView} />
      <PrivateRoute exact path="/" component={StudyListView} />
      <PrivateRoute path="/study/:nodeId/files" component={FileUploadView} />
      <PrivateRoute path="/file-list" component={FileListView} />
    </Switch>
  </Router>
);

export default Routes;
