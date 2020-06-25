import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './routes';
import {ApolloProvider} from '@apollo/client';
import {client} from './state/client';
import {AnalyticsTrackingProvider} from './analyticsTracking';
import DevHeader from './components/Header/DevHeader';

const App = () => {
  return (
    <AnalyticsTrackingProvider>
      <ApolloProvider client={client}>
        <Router>
          <main className="App">
            <DevHeader />
            <Routes />
          </main>
        </Router>
      </ApolloProvider>
    </AnalyticsTrackingProvider>
  );
};

export default App;
