import {DetailView, ListView} from './views';
import {Route, Switch} from 'react-router-dom';

import React from 'react';

const Routes = () => (
  <>
    <Route path="/s3-accounting/:studyId" component={DetailView} />
    <Switch>
      <Route exact path="/s3-accounting" render={() => <ListView />} />
    </Switch>
  </>
);

export default Routes;
