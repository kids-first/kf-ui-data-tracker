import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import {
  LoginView,
  InvestigatorsView,
  FileUploadView,
} from '../views';

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/login" component={LoginView} />
      <PrivateRoute exact path="/" component={InvestigatorsView} />
      <PrivateRoute path="/file-upload" component={FileUploadView} />
    </Switch>
  </Router>
);

export default Routes;
