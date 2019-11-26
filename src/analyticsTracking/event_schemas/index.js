import * as commonDefsSchema from './common_definitions.schema.json';
import * as buttonEventSchema from './BUTTON/BUTTON__EVENT.schema.json';
import * as tooltipEventSchema from './TOOLTIP/TOOLTIP__EVENT.schema.json';
import * as studyListViewToggleSchema from './STUDY_LIST/STUDY_LIST__VIEW_TOGGLE.schema.json';
import * as authLoginSchema from './AUTH/AUTH__LOGIN.schema.json';
import * as studyCardToggleSchema from './STUDY_CARD/STUDY_CARD__TOGGLE_DETAIL.schema.json';
import * as dropdownChagneSchema from './DROPDOWN/DROPDOWN__CHANGE.schema.json';

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
 * (CLICK, HOVER, SEARCH, etc)
 *
 * Schema keys then get translated into event constants in src/analtyicsTracking/index.js
 */
const schemas = {
  LOG_TEST: {description: 'sent in test and ci environments'},
  common_definitions: commonDefsSchema.default,
  // auth
  AUTH__LOGIN: authLoginSchema.default,
  // button
  BUTTON__EVENT: buttonEventSchema.default,
  BUTTON__CLICK: buttonEventSchema.default,
  BUTTON__HOVER: buttonEventSchema.default,
  // mouse
  MOUSE__HOVER: buttonEventSchema.default,
  // dropdown
  DROPDOWN__CHANGE: dropdownChagneSchema.default,
  // DROPDOWN__CLOSE: {},
  // DROPDOWN__OPEN: {},
  // tooltip
  TOOLTIP: tooltipEventSchema.default,
  // study
  STUDY_LIST__VIEW_TOGGLE: studyListViewToggleSchema.default,
  STUDY_LIST__SEARCH: studyListViewToggleSchema.default,
  // study card
  STUDY_CARD__TOGGLE_DETAIL: studyCardToggleSchema.default,
  // STUDY_CARD__CLCK: {},
};

export default schemas;
