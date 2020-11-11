import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {HomeView, BucketDetailView} from './views';

const Routes = () => (
  <>
    <Switch>
      <Route exact path="/storage" render={() => <HomeView />} />
      <Route
        exact
        path="/storage/bucket/:bucketName"
        render={() => <BucketDetailView />}
      />
    </Switch>
  </>
);

export default Routes;
