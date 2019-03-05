import React from 'react';
import Routes from './Routes';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';
import {GridContainer} from './components/Grid';
import {Header} from 'kf-uikit';

const App = () => (
  <ApolloProvider client={client}>

    <GridContainer>
      <Header />
    </GridContainer>

    <main className="App">
      <Routes />
    </main>
    
  </ApolloProvider>
);

export default App;
