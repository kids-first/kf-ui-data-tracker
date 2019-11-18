import React from 'react';
import {EVENT_CONSTANTS, AmplitudeProxy} from '../analyticsTracking';
import {
  popupTracking,
  buttonTracking,
  dropdownTracking,
  popupTracking,
} from './eventUtils';

/** HOC to augment and extend Amplitude tracking methods  */
const withAnalyticsTracking = (Component, config) => {
  return class extends AmplitudeProxy {
    logToConsole = config ? config.logToConsole : false;

    render() {
      return (
        <Component
          {...this.props}
          tracking={{
            ...this._renderPropParams,
            popupTracking: popupTracking(
              this.logEvent,
              this.getAmplitudeEventProperties(),
            ),
            buttonTracking: buttonTracking(this.logEvent),
            dropdownTracking: dropdownTracking(this.logEvent),
            inheritedEventProps: this.getAmplitudeEventProperties(),
            EVENT_CONSTANTS,
          }}
        />
      );
    }
  };
};

export default withAnalyticsTracking;
