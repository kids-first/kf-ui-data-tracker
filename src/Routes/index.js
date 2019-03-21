import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import {LoginView, StudyListView, FilesView} from '../views';

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/login" component={LoginView} />
      <PrivateRoute exact path="/" component={StudyListView} />
      <PrivateRoute path="/study/:kfId/files" component={FilesView} />
    </Switch>
  </Router>
);

export default Routes;
