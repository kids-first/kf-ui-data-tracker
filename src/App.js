import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './Routes';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';
import {
  AnalyticsTrackingProvider,
  TRACKING_CONSTANTS,
} from './analyticsTracking';

import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';

const {APP} = TRACKING_CONSTANTS;

const App = () => {
  return (
    <AnalyticsTrackingProvider>
      <ApolloProvider client={client}>
        <Amplitude eventProperties={{scope: [APP.scope]}}>
          <LogOnMount eventType={APP.MOUNT} />
          <Router>
            <main className="App">
              <Routes />
            </main>
          </Router>
        </Amplitude>
      </ApolloProvider>
    </AnalyticsTrackingProvider>
  );
};

export default App;
