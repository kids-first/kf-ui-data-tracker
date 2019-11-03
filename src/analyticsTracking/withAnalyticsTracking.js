import React from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import analyticsTrackingConstants from '../common/analyticsTrackingConstants';
import {popupTracking, buttonTracking} from './utils';

const EVENT_CONSTANTS = analyticsTrackingConstants;

/** HOC to augment and extend Amplitude tracking methods  */
const withAnalyticsTracking = Component => {
  return class extends Amplitude {
    // proxy our logging calls so we can hook
    // other analytics services into it
    dispatch = (eventType, eventProps) => {
      return this.logEvent(eventType, eventProps);
    };

    instrument = React.memo((eventType, func, props = {}) => {
      return (...params) => {
        const retVal = func ? func(...params) : undefined;

        this.dispatch(eventType, props);

        return retVal;
      };
    });

    render() {
      return (
        <Component
          {...this.props}
          tracking={{
            ...this._renderPropParams,
            logEvent: this.dispatch,
            popupTracking: popupTracking(
              this.dispatch,
              this.getAmplitudeEventProperties(),
            ),
            buttonTracking: buttonTracking(this.dispatch),
            inheritedEventProps: this.getAmplitudeEventProperties(),
            EVENT_CONSTANTS,
          }}
        />
      );
    }
  };
};

export default withAnalyticsTracking;
