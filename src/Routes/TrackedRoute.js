import React from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';
import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';
import {EVENT_CONSTANTS} from '../analyticsTracking';

/** Wrap all of our routes to make them log the view and route they render  */
const TrackedRoute = ({
  component,
  path,
  render,
  logMount = true,
  eventProperties,
  ...rest
}) => {
  return (
    <Amplitude
      eventProperties={{
        view: component ? component.name : render().type.WrappedComponent.name,
        route: path,
        ...eventProperties,
      }}
    >
      {logMount && <LogOnMount eventType={EVENT_CONSTANTS.PAGE.VIEW} />}
      <Route {...{component, path, render}} {...rest} />
    </Amplitude>
  );
};

TrackedRoute.propTypes = {
  /** component passed to Route */
  component: PropTypes.func,
  /** render function to pass to Route  */
  render: PropTypes.func,
  /** url regex path to pass to Route */
  path: PropTypes.string.isRequired,
  /** boolean to fire a PAGEVIEW event Route mount (default: True) */
  logMount: PropTypes.bool,
  /** additional event properties object for events wihin the route */
  eventProperties: PropTypes.object,
};

export default TrackedRoute;
