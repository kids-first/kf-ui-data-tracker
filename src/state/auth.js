import auth0 from 'auth0-js';
import {
  auth0Domain,
  auth0ClientId,
  auth0RedirectUri,
  auth0Aud,
} from '../common/globals';
import jwtDecode from 'jwt-decode';
import amplitude from 'amplitude-js';
import validate from '../analyticsTracking/eventSchemaValidator';
import {EVENT_CONSTANTS} from '../analyticsTracking';
import {AMPLITUDE_KEY} from '../common/globals';

const {AUTH: TRACKING_AUTH} = EVENT_CONSTANTS;

class Auth {
  accessToken;
  idToken;
  expiresAt;
  amplitudeUser;

  logEvent = (eventType, eventProps) => {
    if (!eventType) {
      throw new Error(`EventTypeError: No eventType given`);
    }
    console.log(eventType, eventProps);
    /** Validate our events against their event props schemas (src/analyticsTracking/event_schemas) */
    const eventIsValid = validate(eventType, eventProps);
    if (eventIsValid) amplitude.getInstance().logEvent(eventType, eventProps);
  };

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

          amplitude.getInstance().init(AMPLITUDE_KEY);

          this.logEvent(TRACKING_AUTH.LOGIN, {
            success: true,
            auth_sub: jwtDecode(localStorage.getItem('idToken')).sub.split(
              '|',
            )[0],
          });

          history.push(
            new URLSearchParams(history.location.search).get('from'),
          );
        } else if (err) {
          console.log(err);

          this.logEvent(TRACKING_AUTH.LOGIN, {
            success: false,
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

    // fire analytics events
    this.logEvent('AUTH__LOGOUT');
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
