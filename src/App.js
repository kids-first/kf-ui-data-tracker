import React from 'react';
import Routes from './Routes';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';

const App = () => (
  <ApolloProvider client={client}>
    <main className="App">
      <Routes />
    </main>
  </ApolloProvider>
);

export default App;
