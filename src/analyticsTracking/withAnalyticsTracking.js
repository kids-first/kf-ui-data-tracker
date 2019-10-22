import React from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import analyticsTrackingConstants from '../common/analyticsTrackingConstants';
import {popupTracking, buttonTracking} from './utils';

const EVENT_CONSTANTS = analyticsTrackingConstants;

/** HOC to augment and extend Amplitude tracking methods  */
const withAnalyticsTracking = Component => {
  return class extends Amplitude {
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
            inheritedEventProps: this.getAmplitudeEventProperties(),
            EVENT_CONSTANTS,
          }}
        />
      );
    }
  };
};

export default withAnalyticsTracking;
