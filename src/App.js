import React from 'react';
import Routes from './routes';
import {ApolloProvider} from 'react-apollo';
import {client} from './apollo';

const App = () => (
  <ApolloProvider client={client}>
    <main className="App">
      <Routes />
    </main>
  </ApolloProvider>
);

export default App;
