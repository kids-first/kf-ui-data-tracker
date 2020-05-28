import amplitude from 'amplitude-js';
import jwtDecode from 'jwt-decode';

/**
 * convenience class to log user properties on Auth0 login success
 * @see https://help.amplitude.com/hc/en-us/articles/115002380567-User-Properties-Event-Properties#applying-user-properties-to-events
 */
class AmplitudeUser {
  instance;
  userId;
  auth_sub;

  // decoded jwt values
  auth_user;

  // User's profile from Study Creator
  profile;

  // values to pluck from jwt in the format of [[jwt_prop_name, renmae_to], ... ]
  user_props = [['nickname', 'nickname']];

  constructor(idToken, api_key) {
    if (!idToken) {
      console.error('[Amplitude] Error: no idToken passed on instantiatiaion');
      return false;
    }
    amplitude.getInstance().init(api_key);
    this.instance = amplitude.getInstance();

    this.auth_user = jwtDecode(idToken);

    if (localStorage.getItem('profile') !== null)
      this.profile = JSON.parse(localStorage.getItem('profile'));

    this.auth_sub = this.auth_user.sub;

    this.setId();
    this.setUserProperies();
    return this;
  }

  getProfileProps(profile) {
    // Extract permission group names into an array
    const groups = profile.groups.edges.map(({node}) => node.name);

    // Extract study kf_ids into an array
    const studies = profile.studies.edges.map(({node}) => node.kfId);

    const dateJoined = profile.dateJoined;

    return {groups, studies, dateJoined};
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

    const profileProps = this.profile && this.getProfileProps(this.profile);
    identify.set('groups', profileProps.groups);
    identify.set('studies', profileProps.studies);
    identify.set('dateJoined', profileProps.dateJoined);

    /**
     * @event_scehma analyticsTracking/user/user.schema.json
     */
    this.instance.identify(identify);
  }
}

export default AmplitudeUser;
