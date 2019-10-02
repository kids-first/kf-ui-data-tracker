import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './Routes';
import {AMPLITUDE_KEY} from './common/globals';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';
import AmplitudeUser from './common/amplitudeUserUtils';
import {AmplitudeProvider} from '@amplitude/react-amplitude';
import amplitude from 'amplitude-js';

const App = () => {
  let ampltdUser = null;
  // log amplitude users on auto-login
  if (localStorage.getItem('idToken')) {
    ampltdUser = new AmplitudeUser(localStorage.getItem('idToken'));

    ampltdUser.instance.logEvent('auto Sign In', {
      status: 'SUCCESS',
      auth_sub: ampltdUser.auth_sub_arr[0],
      refferer: document.referrer,
    });
  }

  return (
    <AmplitudeProvider
      amplitudeInstance={amplitude.getInstance()}
      apiKey={AMPLITUDE_KEY}
      userId={ampltdUser ? ampltdUser.userId : null}
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
};

export default App;
