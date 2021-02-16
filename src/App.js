import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './routes';
import {ApolloProvider} from '@apollo/client';
import {client} from './state/client';
import {AnalyticsTrackingProvider} from './analyticsTracking';
import DevHeader from './components/Header/DevHeader';
import {PRIMARY_HOST, REDIRECT_TO_PRIMARY} from './common/globals';
// test
const App = () => {
  // Check that we are on the right host else forward to the primary host
  if (
    PRIMARY_HOST &&
    REDIRECT_TO_PRIMARY &&
    window.location.origin !== PRIMARY_HOST
  ) {
    const redirectUrl = `${PRIMARY_HOST}${window.location.pathname}`;
    console.log('Redirecting to', redirectUrl);
    window.location.replace(redirectUrl);

    return "Redirecting you to the latest Data Tracker..."
  }

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
