import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './Routes';
import {ApolloProvider} from '@apollo/react-common';
import {client} from './state/client';
import {AnalyticsTrackingProvider} from './analyticsTracking';

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AnalyticsTrackingProvider>
        <Router>
          <main className="App">
            <Routes />
          </main>
        </Router>
      </AnalyticsTrackingProvider>
    </ApolloProvider>
  );
};

export default App;
