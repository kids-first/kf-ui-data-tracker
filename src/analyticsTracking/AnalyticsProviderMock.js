import React from 'react';
import AnalyticsTrackingProvider from './AnalyticsTrackingProvider';
import AmplitudeProxy from './AmplitudeProxy';

const AnalyticsProviderMock = ({children}) => (
  <AnalyticsTrackingProvider>
    <AmplitudeProxy eventProperties={{scope: ['TEST']}}>
      {children}
    </AmplitudeProxy>
  </AnalyticsTrackingProvider>
);

export default AnalyticsProviderMock;
