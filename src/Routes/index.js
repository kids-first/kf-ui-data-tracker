import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import {LoginView, StudyListView, FilesView, CallbackView} from '../views';

const Routes = () => (
  <Router>
    <Switch>
      <Route path="/login" component={LoginView} />
      <Route path="/callback" component={CallbackView} />
      <PrivateRoute exact path="/" component={StudyListView} />
      <PrivateRoute path="/study/:kfId/files" component={FilesView} />
    </Switch>
  </Router>
);

export default Routes;
