import React from 'react';
import {EVENT_CONSTANTS} from '../analyticsTracking';

const AnalyticsTrackingContext = React.createContext(EVENT_CONSTANTS);
export default AnalyticsTrackingContext;
