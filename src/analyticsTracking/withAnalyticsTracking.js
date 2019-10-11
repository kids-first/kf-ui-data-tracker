import React from 'react';
import {EVENT_CONSTANTS, AmplitudeProxy} from '../analyticsTracking';

/** HOC to augment and extend Amplitude tracking methods  */
const withAnalyticsTracking = Component => {
  return class extends AmplitudeProxy {
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
