import React from 'react';
import {EVENT_CONSTANTS} from '../analyticsTracking';
import {popupTracking, buttonTracking, dropdownTracking} from './eventUtils';
import AmplitudeProxy from './AmplitudeProxy';

/** HOC to augment and extend Amplitude tracking methods  */
const withAnalyticsTracking = (Component, config) => {
  return class extends AmplitudeProxy {
    logToConsole = config ? config.logToConsole : false;
    saveSchemas = config ? config.saveSchemas : false;

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
