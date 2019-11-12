import React from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';
import {AmplitudeProxy} from '../analyticsTracking';

/**
 * Wrap all of our routes to make them log the view and route they render
 *
 *  @event_scehma analyticsTracking/event_schemas/page/page_view.schema.json
 * */
const TrackedRoute = ({
  component,
  path,
  render,
  logPageView = false,
  eventProperties,
  ...rest
}) => {
  return (
    <AmplitudeProxy
      logToConsole
      eventProperties={{
        view: component
          ? component.name
          : render().type.WrappedComponent
          ? render().type.WrappedComponent.name
          : null,
        route: path,
        ...eventProperties,
      }}
    >
      {({logEvent, EVENT_CONSTANTS: {PAGE}}) => {
        /**
         * here we use logEvent to that it gets
         * pasesd through our proxy class instead
         * of the default Amplitude class used by LogOnMount
         */

        if (logPageView) logEvent(PAGE.VIEW);
        return <Route {...{component, path, render}} {...rest} />;
      }}
    </AmplitudeProxy>
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
  logPageView: PropTypes.bool,
  /** additional event properties object for events wihin the route */
  eventProperties: PropTypes.object,
};

export default TrackedRoute;
