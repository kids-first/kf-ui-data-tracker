import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './routes';
import {ApolloProvider} from '@apollo/react-common';
import {client} from './state/client';
import {AnalyticsTrackingProvider} from './analyticsTracking';

const App = () => {
  return (
    <AnalyticsTrackingProvider>
      <ApolloProvider client={client}>
        <Router>
          <main className="App">
            <Routes />
          </main>
        </Router>
      </ApolloProvider>
    </AnalyticsTrackingProvider>
  );
};

export default App;
