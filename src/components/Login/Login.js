import React from 'react';
import GoogleLogin from 'react-google-login';
import {GOOGLE_APP_ID, EGO_API} from '../../common/globals';
import jwtDecode from 'jwt-decode';
import {ApolloConsumer} from 'react-apollo';
import {Button, Icon} from 'semantic-ui-react';
import {withRouter} from 'react-router';
import {auth} from '../../state/auth';

const onSuccess = (repsonse, client, history) => {
  fetch(EGO_API + '/oauth/google/token', {
    method: 'GET',
    mode: 'cors',
    headers: {
      token: repsonse.tokenId,
      'content-type': 'application/json',
    },
  })
    .then(resp => {
      return resp.text();
    })
    .then(text => {
      localStorage.setItem('egoToken', text);

      const jwtData = jwtDecode(text);
      const user = {...jwtData.context};
      client.writeData({data: {user}});

      history.push('/');

      return text;
    })
    .catch(err => {
      console.log('Problem getting Ego token');
      console.log(err);
    });
};

const onFailure = repsonse => {
  console.log('Problem sign in');
};

const LoginContainer = ({history}) => (
  <ApolloConsumer>
    {client => (
      <Fragment>
        <GoogleLogin
          clientId={GOOGLE_APP_ID}
          buttonText="Sign in with Google"
          onSuccess={response => onSuccess(response, client, history)}
          onFailure={onFailure}
          render={renderProps => (
            <Button
              onClick={() => renderProps.onClick}
              size="large"
              icon
              labelPosition="right"
            >
              Login with Ego
              <Icon name="chevron right" />
            </Button>
          )}
        />
        <Button
          onClick={() => auth.login()}
          size="large"
          positive
          icon
          labelPosition="right"
        >
          Login with Auth0
          <Icon name="chevron right" />
        </Button>
      </Fragment>
    )}
  </ApolloConsumer>
);

export default withRouter(LoginContainer);
