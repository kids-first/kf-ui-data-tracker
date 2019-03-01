import React from 'react';
import GoogleLogin from 'react-google-login';
import {googleAppId, egoApi} from '../config';

const onSuccess = repsonse => {
  fetch(egoApi + '/oauth/google/token', {
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

const LoginView = () => (
  <GoogleLogin
    clientId={googleAppId}
    buttonText="Login"
    onSuccess={onSuccess}
    onFailure={onFailure}
  />
);

export default LoginView;
