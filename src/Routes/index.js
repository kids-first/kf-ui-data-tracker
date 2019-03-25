import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

import {Header} from 'kf-uikit';
import {LoginView, StudyListView, FilesView, CallbackView} from '../views';

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
      <PrivateRoute path="/study/:kfId/files" component={FilesView} />
    </div>
  </Router>
);

export default Routes;
