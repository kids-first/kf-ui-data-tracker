import React from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';
import {AmplitudeProxy} from '../analyticsTracking';

/**
 * Wrap all of our routes to make them log the view and route they render
 *
 *  @event_scehma analyticsTracking/event_schemas/page/page_view.schema.json
 * */
const TrackedRoute = ({logPageView = false, eventProperties, ...rest}) => (
  <AmplitudeProxy
    eventProperties={{
      /** viewName is set for components wrapped with withAnlayticsTracking HOC  */
      view: rest.render
        ? rest.render().type.viewName || rest.render().type.name
        : null,
      route: rest.path,
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
      return <Route {...rest} />;
    }}
  </AmplitudeProxy>
);

TrackedRoute.propTypes = {
  /** component passed to Route */
  component: PropTypes.func,
  /** render function to pass to Route  */
  render: PropTypes.func,
  /** boolean to fire a PAGEVIEW event Route mount (default: True) */
  logPageView: PropTypes.bool,
  /** additional event properties object for events wihin the route */
  eventProperties: PropTypes.object,
};

export default TrackedRoute;
