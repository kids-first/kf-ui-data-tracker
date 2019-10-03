import React from 'react';
import {AMPLITUDE_KEY} from '../common/globals';
import {AmplitudeProvider} from '@amplitude/react-amplitude';
import amplitude from 'amplitude-js';
import AnalyticsTrackingContext from './AnalyticsTrackingContext';
import analyticsTrackingConstants from '../common/analyticsTrackingConstants';
import AmplitudeUser from './amplitudeUserUtils';

const {AUTH, APP} = analyticsTrackingConstants;

let amplitudeUser = null;
// log amplitude users on auto-login
if (localStorage.getItem('idToken')) {
  amplitudeUser = new AmplitudeUser(localStorage.getItem('idToken'));

  amplitudeUser.instance.logEvent(AUTH.LOGIN, {
    scope: [AUTH.scope, APP.scope],
    status: 'SUCCESS',
    auth_sub: amplitudeUser.auth_sub_arr[0],
  });
}

const AnalyticsTrackingProvider = props => {
  return (
    <AnalyticsTrackingContext.Provider value={analyticsTrackingConstants}>
      <AmplitudeProvider
        amplitudeInstance={amplitude.getInstance()}
        apiKey={AMPLITUDE_KEY}
        userId={amplitudeUser ? amplitudeUser.userId : null}
      >
        {props.children}
      </AmplitudeProvider>
    </AnalyticsTrackingContext.Provider>
  );
};
export default AnalyticsTrackingProvider;
