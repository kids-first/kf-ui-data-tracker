import React from 'react';
import {AMPLITUDE_KEY} from '../common/globals';
import {AmplitudeProvider} from '@amplitude/react-amplitude';
import amplitude from 'amplitude-js';
import AmplitudeProxy from './AmplitudeProxy';
import AmplitudeUser from './AmplitudeUser';

let amplitudeUser = null;
// log amplitude users on auto-login
if (localStorage.getItem('idToken')) {
  amplitudeUser = new AmplitudeUser(
    localStorage.getItem('idToken'),
    AMPLITUDE_KEY,
  );
}

const AnalyticsTrackingProvider = props => (
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
);

export default AnalyticsTrackingProvider;
