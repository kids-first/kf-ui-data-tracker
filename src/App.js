import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './Routes';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <main className="App">
        <Routes />
      </main>
    </Router>
  </ApolloProvider>
);

export default App;
