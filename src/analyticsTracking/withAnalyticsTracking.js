import React from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import analyticsTrackingConstants from '../common/analyticsTrackingConstants';

const EVENT_CONSTANTS = analyticsTrackingConstants;

const buttonTracking = log => (buttonName, buttonEventProps) => ({
  onMouseOver: e =>
    log(EVENT_CONSTANTS.MOUSE.HOVER, {
      button_name: buttonName,
      ...buttonEventProps,
    }),
  onClick: e =>
    log(EVENT_CONSTANTS.MOUSE.CLICK, {
      button_name: buttonName,
      ...buttonEventProps,
    }),
});

/** HOC to augment and extend Amplitude tracking methods  */
const withAnalyticsTracking = Component => {
  return class extends Amplitude {
    constructor(props) {
      super(props);

      // augment the Amplitude consumer with new props
      this._renderPropParams = {
        ...this._renderPropParams,
        logEvent: this.logEvent,
        instrument: this.instrument,
        buttonTracking: buttonTracking(this.logEvent),
      };
    }

    render() {
      return (
        <Component
          {...this.props}
          tracking={{
            ...this._renderPropParams,
            EVENT_CONSTANTS,
          }}
        />
      );
    }
  };
};

export default withAnalyticsTracking;
