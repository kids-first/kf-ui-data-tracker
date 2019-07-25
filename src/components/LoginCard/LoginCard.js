import React from 'react';
import GoogleLogin from 'react-google-login';
import { GOOGLE_APP_ID, EGO_API } from '../../common/globals';
import jwtDecode from 'jwt-decode';
import { ApolloConsumer } from 'react-apollo';
import { Button, Icon, Responsive } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { auth } from '../../state/auth';
import Auth0_logo from '../../assets/Auth0_logo.png';

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
      const user = { ...jwtData.context };
      client.writeData({ data: { user } });

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
}

console.log('Responsive.onlyMobile', Responsive.onlyMobile)
console.log('Responsive.onlyTablet', Responsive.onlyTablet)
console.log('Responsive.onlyComputer', Responsive.onlyComputer)
console.log('Responsive.onlyLargeScreen', Responsive.onlyLargeScreen)
console.log('Responsive.onlyWideScreen', Responsive.onlyWidescreen)

const LoginContainer = ({ history }) => (
  <ApolloConsumer>
    {client => (
      <>
        <Responsive as={Button.Group} fluid vertical textAlign="center" maxWidth={Responsive.onlyLargeScreen.maxWidth}>
          <Button
            className="button--login"
            onClick={() => auth.login()}
            size="large"
            color="black"
            fluid
          >
            <img className="auth0-logo m-auto" src={Auth0_logo} alt="Auth0 logo" />
          </Button>
          <GoogleLogin
            clientId={GOOGLE_APP_ID}
            buttonText="Sign in with Google"
            onSuccess={response => onSuccess(response, client, history)}
            onFailure={onFailure}
            render={renderProps => (
              <Button
                className="button--login"
                onClick={() => renderProps.onClick}
                size="large"
                textAlign="center"
                primary
              >

                <span className="m-auto">
                  <Icon name="google" />
                  Google
                </span>
              </Button>
            )}
          />
        </Responsive>

        <Responsive as={Button.Group} fluid textAlign="center" minWidth={Responsive.onlyLargeScreen.maxWidth}>
          <Button
            className="button--login"
            onClick={() => auth.login()}
            size="large"
            color="black"
          >
            <img className="auth0-logo" src={Auth0_logo} alt="Auth0 logo" />
          </Button>
          <Button.Or className="button--login" />
          <GoogleLogin
            clientId={GOOGLE_APP_ID}
            buttonText="Sign in with Google"
            onSuccess={response => onSuccess(response, client, history)}
            onFailure={onFailure}
            render={renderProps => (
              <Button
                className="button--login"
                onClick={() => renderProps.onClick}
                size="large"
                primary
              >
                <Icon name="google" />
                Google
            </Button>
            )}
          />
        </Responsive>
      </>
    )}
  </ApolloConsumer>
);

export default withRouter(LoginContainer);
