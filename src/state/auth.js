import auth0 from 'auth0-js';
import jwtDecode from 'jwt-decode';
import {
  auth0Domain,
  auth0ClientId,
  auth0RedirectUri,
  auth0Aud,
} from '../common/globals';

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
          const token = authResult.idToken || authResult.accessToken;
          const decoded = jwtDecode(token);
          const groups =
            decoded['https://kidsfirstdrc.org/groups'] ||
            decoded.context.groups;
          const roles =
            decoded['https://kidsfirstdrc.org/roles'] || decoded.context.roles;
          localStorage.setItem('groups', JSON.stringify(groups));
          localStorage.setItem('roles', JSON.stringify(roles));
          history.push(
            new URLSearchParams(history.location.search).get('from'),
          );
        } else if (err) {
          console.log(err);
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
    localStorage.removeItem('egoToken');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }
}

export const auth = new Auth();
