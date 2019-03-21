import React from 'react';
import {auth} from '../state/auth';

const CallbackView = ({history}) => {
  auth.handleAuthentication(history);
  return <div>Redirecting</div>;
};

export default CallbackView;
