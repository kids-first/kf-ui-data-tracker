import React from 'react';
import {Route, Switch} from 'react-router-dom';
import AdminRoutes from './admin/routes';

const Routes = () => (
    <Switch>
        <Route path="/next/admin" component={AdminRoutes} />;
    </Switch>
);

export default Routes;
