import React from 'react';
import {useQuery} from '@apollo/client';
import TrackedRoute from './TrackedRoute';
import NotFoundView from '../views/NotFoundView';
import {hasPermissions} from '../common/permissions';
import {MY_PROFILE} from '../state/queries';
import {Dimmer, Loader} from 'semantic-ui-react';

/**change_study
 * Only renders the route if the user has the correct permissions
 */
const RestrictedRoute = ({component: Component, permissions, ...rest}) => {
  const {loading, data} = useQuery(MY_PROFILE);

  const user = data && data.myProfile;

  if (loading || !user)
    return (
      <Dimmer inverted active>
        <Loader>Loading</Loader>
      </Dimmer>
    );

  return (
    <TrackedRoute
      {...rest}
      render={props =>
        hasPermissions(user, permissions) ? (
          <Component {...props} />
        ) : (
          <NotFoundView
            title="Not allowed"
            message="You do not have the permissions necessary to view this page"
          />
        )
      }
    />
  );
};

export default RestrictedRoute;
