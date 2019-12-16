import React from 'react';
import AnalyticsTrackingProvider from '../../AnalyticsTrackingProvider';
import AmplitudeProxy from './AmplitudeProxy';

const AnaltyticsMockProvider = ({children}) => (
  <AnalyticsTrackingProvider>
    <AmplitudeProxy
      eventProperties={{scope: [process.env.NODE_ENV.toUpperCase()]}}
    >
      {children}
    </AmplitudeProxy>
  </AnalyticsTrackingProvider>
);

export default AnaltyticsMockProvider;
