import React from 'react';
import AnalyticsTrackingProvider from './AnalyticsTrackingProvider';

import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';

const AnaltyticsMockProvider = ({children}) => (
  <AnalyticsTrackingProvider>
    <Amplitude eventProperties={{scope: ['TEST']}}>
      <LogOnMount eventType={'TEST_MOUNT'} />
      {children}
    </Amplitude>
  </AnalyticsTrackingProvider>
);

export default AnaltyticsMockProvider;
