import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './Routes';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';
import {AnalyticsTrackingProvider} from './analyticsTracking';
import {Amplitude} from '@amplitude/react-amplitude';

const App = () => {
  return (
    <AnalyticsTrackingProvider>
      <Amplitude eventProperties={{path: window.location.pathname}}>
        <ApolloProvider client={client}>
          <Router>
            <main className="App">
              <Routes />
            </main>
          </Router>
        </ApolloProvider>
      </Amplitude>
    </AnalyticsTrackingProvider>
  );
};

export default App;
