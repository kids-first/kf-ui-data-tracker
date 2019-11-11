/**
 * This file contains string constants for Amplitude eventTypes and
 * eventProperties in the format of:
 * {
 *  [<scope_string>] : {
 *     scope: <scope_string>,
 *     [<event_type_string>] : <event_type_string>,
 *      ...event_key_value_pairs
 *  }
 * }
 *
 * let scopeEvent = scope.event
 * --> scope_event
 */

/**
 * reflects a list of keys to key:value pairs
 * @param {array} keys
 */
function keyMirror(keys) {
  keys = Array.isArray(keys) ? keys : Object.keys(keys);
  var mirror = {};
  keys.forEach(v => (mirror[v] = v));
  return mirror;
}

const events = eventsList => keyMirror(eventsList);

/**
 * creates a proxied object with getters that will
 * return the event name with the scope name appended (<scope_name>_<event_name>)
 *
 * This is used to sanitize and keep all events and scopes consistent
 *
 * @param {string} name scopeName
 * @param {array} eventsList array of event name strings
 * @return {
 *   <SCOPE_NAME>: Proxy {
 *     scope:  <SCOPE_NAME>,
 *     <EVENT_NAME>: <EVENT_NAME>,
 *
 *      get [<EVENT_NAME>](){
 *        return this.<SCOPE_NAME>+_+<EVENT_NAME>
 *      }
 *  }
 * }
 */
const scope = (name, eventsList) => {
  let scopeOriginal = {
    scope: name.trim().toUpperCase(),
    ...events(
      eventsList
        .filter(x => typeof x === 'string')
        .map(e =>
          e
            .trim()
            .replace(' ', '_')
            .toUpperCase(),
        ),
    ),
  };
  /**
   * @see https://stackoverflow.com/a/7891968
   */
  let scopeProxy = new Proxy(scopeOriginal, {
    get(target, name, receiver) {
      let rv = Reflect.get(target, name, receiver);
      if (typeof rv === 'string' && name !== 'scope') {
        rv = Reflect.get(target, 'scope', receiver) + '_' + rv;
      }
      return rv;
    },
  });

  return {
    [name.trim().toUpperCase()]: scopeProxy,
  };
};

const MOUSE_EVENTS = ['HOVER', 'CLICK'];
const DOCUMENT_EVENTS = ['UPLOAD', 'DOWNLOAD', 'DELETE', 'EDIT'];
const INPUT_EVENTS = ['_BLUR', '_FOCUS', '_CHANGE'];
const MODAL_EVENTS = ['MODAL__OPEN', 'MODAL__CLOSE'];

/**
 * analytics tracking constants object
 */
const analyticsTrackingConstants = {
  ...scope('INPUT', ['TEXT', ...INPUT_EVENTS]),
  ...scope('MOUSE', MOUSE_EVENTS),
  ...scope('AUTH', ['LOGIN', 'LOGOUT']),
  ...scope('PAGE', ['VIEW']),
  ...scope('STUDY_LIST_', ['VIEW_TOGGLE', 'SEARCH', 'ADD_STUDY']),
  ...scope('STUDY_TABLE_', MOUSE_EVENTS),
  ...scope('STUDY_CARD_', ['TOGGLE_DETAIL', ...MOUSE_EVENTS]),
  ...scope('STUDY_INFO_', DOCUMENT_EVENTS),
  ...scope('UPLOAD_WIZARD_', ['STEP', 'CLOSE']),
  ...scope('DOCUMENT_', [...DOCUMENT_EVENTS, ...MODAL_EVENTS]),
  ...scope('DOCUMENT_INFO_', DOCUMENT_EVENTS),
  ...scope('DOCUMENT_VERSION_', [
    ...DOCUMENT_EVENTS,
    ...MOUSE_EVENTS,
    ...MODAL_EVENTS,
  ]),
  ...scope('NEW_DOCUMENT_', DOCUMENT_EVENTS),
  ...scope('NEW_VERSION_', [...DOCUMENT_EVENTS, ...MOUSE_EVENTS]),
  ...scope('TOOLTIP', MOUSE_EVENTS),
  ...scope('AVATAR_', MOUSE_EVENTS),
};

export default analyticsTrackingConstants;
