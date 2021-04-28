import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {Users} from './views';

const Routes = () => (
    <Switch>
        <Route path="/next/admin/users" component={Users} />;
    </Switch>
);

export default Routes;
