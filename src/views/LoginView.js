import React from 'react';
import GoogleLogin from 'react-google-login';
import {googleAppId, egoApi} from '../config';
import {withRouter} from 'react-router';

const onSuccess = (repsonse, history) => {
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

const LoginView = ({history}) => (
  <GoogleLogin
    clientId={googleAppId}
    buttonText="Login"
    onSuccess={response => onSuccess(response, history)}
    onFailure={onFailure}
  />
);

export default withRouter(LoginView);
