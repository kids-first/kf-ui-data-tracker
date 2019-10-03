import React from 'react';
import {Header, Grid, Segment, Dimmer, Loader} from 'semantic-ui-react';
import {auth} from '../state/auth';

import {AnalyticsViewConsumer} from '../analyticsTracking';

const LoginView = ({location, history}) => {
  auth.login(location.state ? location.state.from : '/', false);
  return (
    <AnalyticsViewConsumer
      mountProperties={{
        originalUrl: location.state ? location.state.from : '/',
      }}
      view="LoginView"
    >
      <Grid>
        <Grid.Column computer="8" tablet="12" mobile="15">
          <Segment placeholder>
            <Dimmer active inverted>
              <Loader inverted size="huge">
                <Header as="h2" className="mt-6 mb-15">
                  Kids First Data Tracker
                </Header>
                Redirecing you to the login page...
              </Loader>
            </Dimmer>
          </Segment>
        </Grid.Column>
      </Grid>
    </AnalyticsViewConsumer>
  );
};

export default LoginView;
