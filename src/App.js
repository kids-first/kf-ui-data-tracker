import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import Routes from './Routes';
import {AMPLITUDE_KEY} from './common/globals';
import {ApolloProvider} from 'react-apollo';
import {client} from './state/client';
import AmplitudeUser from './common/amplitudeUserUtils';
import analyticsTrackingConstants from './common/analyticsTrackingConstants';
import {
  AmplitudeProvider,
  Amplitude,
  LogOnMount,
} from '@amplitude/react-amplitude';
import amplitude from 'amplitude-js';

const {LOGIN, APP} = analyticsTrackingConstants;

const App = () => {
  let ampltdUser = null;
  // log amplitude users on auto-login
  if (localStorage.getItem('idToken')) {
    ampltdUser = new AmplitudeUser(localStorage.getItem('idToken'));

    ampltdUser.instance.logEvent(LOGIN.LOGIN, {
      scope: [LOGIN.scope, APP.scope],
      status: 'SUCCESS',
      auth_sub: ampltdUser.auth_sub_arr[0],
      referrer: document.referrer,
    });
  }

  return (
    <AmplitudeProvider
      amplitudeInstance={amplitude.getInstance()}
      apiKey={AMPLITUDE_KEY}
      userId={ampltdUser ? ampltdUser.userId : null}
    >
      <ApolloProvider client={client}>
        <Amplitude eventProperties={{scope: [APP.scope]}}>
          <LogOnMount eventType={APP.MOUNT} />
          <Router>
            <main className="App">
              <Routes />
            </main>
          </Router>
        </Amplitude>
      </ApolloProvider>
    </AmplitudeProvider>
  );
};

export default App;
