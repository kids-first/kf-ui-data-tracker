import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './Routes';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';
import {Grommet} from 'grommet';
import {theme} from './grommet';

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Grommet theme={theme}>
        <main className="App">
          <Routes />
        </main>
      </Grommet>
    </Router>
  </ApolloProvider>
);

export default App;
