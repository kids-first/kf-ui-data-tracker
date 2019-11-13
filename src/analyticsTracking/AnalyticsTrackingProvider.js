import React from 'react';
import {AMPLITUDE_KEY} from '../common/globals';
import {AmplitudeProvider} from '@amplitude/react-amplitude';
import amplitude from 'amplitude-js';
import AnalyticsTrackingContext from './AnalyticsTrackingContext';
import AmplitudeProxy from './AmplitudeProxy';
import analyticsTrackingConstants from '../common/analyticsTrackingConstants';
import AmplitudeUser from './AmplitudeUser';

const {AUTH} = analyticsTrackingConstants;

let amplitudeUser = null;
// log amplitude users on auto-login
if (localStorage.getItem('idToken')) {
  amplitudeUser = new AmplitudeUser(
    localStorage.getItem('idToken'),
    AMPLITUDE_KEY,
  );

  amplitudeUser.instance.logEvent(AUTH.LOGIN, {
    status: 'SUCCESS',
    auth_sub: amplitudeUser.auth_sub_arr[0],
  });
}

const AnalyticsTrackingProvider = props => {
  return (
    <AnalyticsTrackingContext.Provider value={analyticsTrackingConstants}>
      <AmplitudeProvider
        amplitudeInstance={
          amplitudeUser ? amplitudeUser.instance : amplitude.getInstance()
        }
        apiKey={AMPLITUDE_KEY}
        userId={amplitudeUser ? amplitudeUser.userId : null}
      >
        <AmplitudeProxy eventProperties={{path: window.location.pathname}}>
          {props.children}
        </AmplitudeProxy>
      </AmplitudeProvider>
    </AnalyticsTrackingContext.Provider>
  );
};
export default AnalyticsTrackingProvider;
