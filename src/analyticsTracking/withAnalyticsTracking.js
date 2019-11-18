import React from 'react';
import {EVENT_CONSTANTS, AmplitudeProxy} from '../analyticsTracking';

/** HOC to augment and extend Amplitude tracking methods  */
const withAnalyticsTracking = (Component, config) => {
  class AnalyticsTrackingHOC extends AmplitudeProxy {
    logToConsole = config ? config.logToConsole : false;
    saveSchemas = config ? config.saveSchemas : false;
    render() {
      return (
        <Component
          {...this.props}
          tracking={{
            ...this._renderPropParams,
            inheritedEventProps: this.getAmplitudeEventProperties(),
            EVENT_CONSTANTS,
          }}
        />
      );
    }
  }
  AnalyticsTrackingHOC.displayName = `withAnalyticsTracking(${Component.name})`;
  /** set the parent view name to use in eventProps.view */
  AnalyticsTrackingHOC.viewName = Component.name;
  return AnalyticsTrackingHOC;
};

export default withAnalyticsTracking;
