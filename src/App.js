import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './Routes';
import {AMPLITUDE_KEY} from './common/globals';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';
import amplitude from 'amplitude-js';
import {AmplitudeProvider} from '@amplitude/react-amplitude';

const App = () => (
  <AmplitudeProvider
    amplitudeInstance={amplitude.getInstance()}
    apiKey={AMPLITUDE_KEY}
  >
    <ApolloProvider client={client}>
      <Router>
        <main className="App">
          <Routes />
        </main>
      </Router>
    </ApolloProvider>
  </AmplitudeProvider>
);

export default App;
