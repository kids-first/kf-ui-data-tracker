import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import {
  HomeView,
  InvestigatorListView,
  FileUploadView,
  FileListView,
} from './views';

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={HomeView} />
      <Route path="/investigator-list" component={InvestigatorListView} />
      <Route path="/file-upload" component={FileUploadView} />
      <Route path="/file-list" component={FileListView} />
    </Switch>
  </Router>
);

export default Routes;
