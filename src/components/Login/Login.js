import React from 'react';
import GoogleLogin from 'react-google-login';
import {GOOGLE_APP_ID, EGO_API} from '../../common/globals';
import {withRouter} from 'react-router';

const onSuccess = (repsonse, history) => {
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
  <GoogleLogin
    clientId={GOOGLE_APP_ID}
    buttonText="Sign in with Google"
    onSuccess={response => onSuccess(response, history)}
    onFailure={onFailure}
  />
);

export default withRouter(LoginContainer);
