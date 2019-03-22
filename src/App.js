import React from 'react';
import Routes from './Routes';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';
import {Header} from 'kf-uikit';

const App = () => (
  <ApolloProvider client={client}>
    <main className="App">
      <Header logo={{logoHref: '/'}} />
      <Routes />
    </main>
  </ApolloProvider>
);

export default App;
