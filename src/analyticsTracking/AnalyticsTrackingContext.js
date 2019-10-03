import React from 'react';
import analyticsTrackingConstants from '../common/analyticsTrackingConstants';

const AnalyticsTrackingContext = React.createContext(
  analyticsTrackingConstants,
);
export default AnalyticsTrackingContext;
