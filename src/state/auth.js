import auth0 from 'auth0-js';
import jwtDecode from 'jwt-decode';
import {
  auth0Domain,
  auth0ClientId,
  auth0RedirectUri,
  auth0Aud,
} from '../common/globals';
import amplitude from 'amplitude-js';

const ampltd = amplitude.getInstance();
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
          const user = jwtDecode(authResult.idToken);
          const userSubArr = user.sub.split('|');
          // use the auth providers "sub" field as the stable user id for amplitude
          ampltd.setUserId(userSubArr[1]);
          var identify = new ampltd.Identify();
          [
            ['email'],
            ['email_verified'],
            ['family_name', 'last_name'],
            ['given_name', 'first_name'],
            ['https://kidsfirstdrc.org/roles', 'roles'],
            ['https://kidsfirstdrc.org/permissions', 'premissions'],
            ['picture'],
          ].forEach(prop => {
            identify.set(prop[1] || prop[0], user[prop[0]]);
          });
          ampltd.identify(identify);

          ampltd.logEvent('Sign In', {
            status: 'SUCCESS',
            auth_sub: userSubArr[0],
          });

          history.push(
            new URLSearchParams(history.location.search).get('from'),
          );
        } else if (err) {
          console.log(err);
          ampltd.logEvent('Sign In', {
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
