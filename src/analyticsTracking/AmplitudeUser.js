import amplitude from 'amplitude-js';
import jwtDecode from 'jwt-decode';

/**
 * convenience class to log user properties on Auth0 login success
 * @see https://help.amplitude.com/hc/en-us/articles/115002380567-User-Properties-Event-Properties#applying-user-properties-to-events
 */
class AmplitudeUser {
  instance;
  userId;
  auth_sub_arr;

  // decoded jwt values
  auth_user;

  // values to pluck from jwt in the format of [[jwt_prop_name, renmae_to], ... ]
  user_props = [
    ['https://kidsfirstdrc.org/roles', 'roles'],
    ['https://kidsfirstdrc.org/groups', 'studies'],
    ['https://kidsfirstdrc.org/permissions', 'permissions'],
  ];

  constructor(idToken, api_key) {
    amplitude.getInstance().init(api_key);
    this.instance = amplitude.getInstance();
    this.auth_user = jwtDecode(idToken);

    this.auth_sub_arr = this.auth_user.sub.split('|');

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
    this.userId = this.auth_sub_arr[1];
    this.instance.setUserId(this.userId);
  }

  setUserProperies() {
    var identify = new this.instance.Identify();

    // pluck properties from dceoded jwt and rename
    this.user_props.forEach(prop => {
      identify.set(prop[1] || prop[0], this.auth_user[prop[0]]);
    });
    // send to amplitude
    this.instance.identify(identify);
  }
}

export default AmplitudeUser;
