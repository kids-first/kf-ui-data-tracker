import React from 'react';
import {AMPLITUDE_KEY} from '../common/globals';
import AmplitudeProvider from './services/Amplitude/AmplitudeProvider';
import AmplitudeProxy from './services/Amplitude/AmplitudeProxy';
import amplitude from 'amplitude-js';

// import {
// AmplitudeProvider,
// Amplitude,
// LogOnMount,
// useAmplitude,
// } from 'react-amplitude-hooks';
console.log('AMPLITUDE_KEY', AMPLITUDE_KEY);
console.log(amplitude.getInstance());
const AnalyticsTrackingProvider = props => (
  <AmplitudeProvider
    amplitudeInstance={amplitude.getInstance()}
    apiKey={AMPLITUDE_KEY}
  >
    <AmplitudeProxy
      eventProperties={{path: window.location.pathname, scope: ['App']}}
    >
      {props.children}
    </AmplitudeProxy>
  </AmplitudeProvider>
);

export default AnalyticsTrackingProvider;
