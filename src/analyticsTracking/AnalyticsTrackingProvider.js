import React from 'react';
import {AMPLITUDE_KEY} from '../common/globals';
import AmplitudeProvider from './services/Amplitude/AmplitudeProvider';
import amplitude from 'amplitude-js';
import AmplitudeProxy from './services/Amplitude/AmplitudeProxy';

const AnalyticsTrackingProvider = props => (
  <AmplitudeProvider
    amplitudeInstance={amplitude.getInstance()}
    apiKey={AMPLITUDE_KEY}
  >
    <AmplitudeProxy eventProperties={{path: window.location.pathname}}>
      {props.children}
    </AmplitudeProxy>
  </AmplitudeProvider>
);

export default AnalyticsTrackingProvider;
