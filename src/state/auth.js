import auth0 from 'auth0-js';
import {
  auth0Domain,
  auth0ClientId,
  auth0RedirectUri,
  auth0Aud,
} from '../common/globals';
import amplitude from 'amplitude-js';
import AmplitudeUser from '../common/amplitudeUserUtils';

class Auth {
  accessToken;
  idToken;
  expiresAt;

  auth0 = new auth0.WebAuth({
    domain: auth0Domain,
    clientID: auth0ClientId,
    redirectUri: auth0RedirectUri,
    responseType: 'token id_token',
    audience: auth0Aud,
    scope: 'openid profile email',
  });

  login(originalUrl) {
    this.auth0.authorize({
      redirectUri: auth0RedirectUri + '?from=' + originalUrl,
    });
  }

  handleAuthentication(history) {
    if (/access_token|id_token|error/.test(history.location.hash)) {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          localStorage.setItem('accessToken', authResult.accessToken);
          localStorage.setItem('idToken', authResult.idToken);
          const ampltdUser = new AmplitudeUser(authResult.idToken);

          ampltdUser.instance.logEvent('Sign In', {
            status: 'SUCCESS',
            auth_sub: ampltdUser.auth_sub_arr[0],
            referrer: document.referrer,
          });

          history.push(
            new URLSearchParams(history.location.search).get('from'),
          );
        } else if (err) {
          console.log(err);
          amplitude.getInstance().logEvent('Sign In', {
            status: 'FAILED',
            err,
          });
          alert(`Error: ${err.error}. Check the console for further details.`);
        }
      });
    }
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  logout() {
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');

    amplitude.getInstance().logEvent('Sign Out');
    amplitude.getInstance().setUserId(null); // not string 'null'
    amplitude.getInstance().regenerateDeviceId();
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}

export const auth = new Auth();
