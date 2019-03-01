import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {ApolloProvider} from 'react-apollo';
import jwtDecode from 'jwt-decode';
import {client} from './apollo';

import {
  HomeView,
  InvestigatorListView,
  FileUploadView,
  FileListView,
  LoginView,
} from './views';

const App = () => {
  const hasToken = () => {
    const token = localStorage.getItem('egoToken');
    if (token == null) {
      return false;
    }
    const user = jwtDecode(token).context.user;
    return (
      user.status === 'Approved' &&
      jwtDecode(token).exp > Math.floor(new Date().getTime() / 1000)
    );
  };

  return hasToken() ? (
    <ApolloProvider client={client}>
      <Router>
        <main className="App">
          <Switch>
            <Route exact path="/" component={HomeView} />
            <Route path="/investigator-list" component={InvestigatorListView} />
            <Route path="/file-upload" component={FileUploadView} />
            <Route path="/file-list" component={FileListView} />
          </Switch>
        </main>
      </Router>
    </ApolloProvider>
  ) : (
    <LoginView />
  );
};

export default App;
