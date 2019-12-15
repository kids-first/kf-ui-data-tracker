import amplitude from 'amplitude-js';
import jwtDecode from 'jwt-decode';
import {isValidAmplitudeInstance} from '@amplitude/react-amplitude/src/lib/validation';

/**
 * convenience class to log user properties on Auth0 login success
 * @see https://help.amplitude.com/hc/en-us/articles/115002380567-User-Properties-Event-Properties#applying-user-properties-to-events
 */
class AmplitudeUser {
  instance;
  userId;
  auth_sub;

  // decoded jwt valuess
  auth_user;

  // values to pluck from jwt in the format of [[jwt_prop_name, renmae_to], ... ]
  user_props = [
    ['https://kidsfirstdrc.org/roles', 'roles'],
    ['https://kidsfirstdrc.org/groups', 'studies'],
    ['https://kidsfirstdrc.org/permissions', 'permissions'],
  ];

  constructor(instance, idToken, api_key) {
    if (!idToken) {
      console.error('[Amplitude] Error: no idToken passed on instantiatiaion');
      return false;
    }

    if (!isValidAmplitudeInstance(instance))
      amplitude.getInstance().init(api_key);

    this.instance = instance || amplitude.getInstance().init(api_key);

    this.auth_user = idToken ? jwtDecode(idToken) : null;

    this.auth_sub = this.auth_user.sub;

    this.setId();
    this.setUserProperies();

    return this;
  }

  /**
   * UUID for amplitude using the parsed value of the
   * auth provider sub field
   * @param {string} id
   */
  setId(id) {
    this.userId = this.auth_sub;
    this.instance.setUserId(id || this.userId);
  }

  setUserProperies() {
    var identify = new this.instance.Identify();

    // pluck properties from dceoded jwt and rename
    this.user_props.forEach(prop => {
      identify.set(prop[1] || prop[0], this.auth_user[prop[0]]);
    });
    /**
     * @event_scehma analyticsTracking/user/user.schema.json
     */
    this.instance.identify(identify);
  }
}

export default AmplitudeUser;
