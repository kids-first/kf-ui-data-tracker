import React from 'react';
import Routes from './routes';
import {ApolloProvider} from 'react-apollo';
import {hasToken} from './authentication';
import {client} from './apollo';

import {LoginView} from './views';

const App = () => {
  return hasToken() ? (
    <ApolloProvider client={client}>
      <main className="App">
        <Routes />
      </main>
    </ApolloProvider>
  ) : (
    <LoginView />
  );
};

export default App;
