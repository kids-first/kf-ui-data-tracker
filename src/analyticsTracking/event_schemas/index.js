import * as commonDefsSchema from './common_defs.schema.json';
import * as authLoginSchema from './AUTH/AUTH__LOGIN.schema.json';
import * as pageViewSchema from './PAGE/PAGE__VIEW.schema.json';

/**
 * List of all possible analytics event types associated with
 * their validating json schema.
 *
 * Schema keys coorespond to specific events types and should
 * be in the format of <scope>__<action>, with a em dash delimeter.
 *
 * <scope> is the specific UI/application area the event
 * was fired from (STUDY_LIST, BUTTON, STUDY_CARD, etc.)
 *
 * <action> is the especifc event that was performed within that scope
 * (CLICK, HOVER, SEARCH, etc)PE
 *
 * Schema keys then get translated into event constants in src/analtyicsTracking/index.js
 */
const schemas = {
  LOG_TEST: {description: 'sent in test and ci environments'},
  common_definitions: commonDefsSchema.default,
  // page view
  PAGE__VIEW: pageViewSchema.default,
  // auth
  AUTH__LOGIN: authLoginSchema.default,
  AUTH__LOGOUT: {no: 'event props'},
  //button
  BUTTON__CLICK: {},
  BUTTON__HOVER: {},
  // input
  INPUT__TEXT: {},
  // study list view
  STUDY_LIST__VIEW_TOGGLE: {},
  STUDY_LIST__ADD_STUDY: {},
  STUDY_LIST__SEARCH: {},
};

export default schemas;
