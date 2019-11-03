import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './Routes';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';
import {AnalyticsTrackingProvider, AmplitudeProxy} from './analyticsTracking';

const App = () => {
  return (
    <AnalyticsTrackingProvider>
      <AmplitudeProxy eventProperties={{path: window.location.pathname}}>
        <ApolloProvider client={client}>
          <Router>
            <main className="App">
              <Routes />
            </main>
          </Router>
        </ApolloProvider>
      </AmplitudeProxy>
    </AnalyticsTrackingProvider>
  );
};

export default App;
