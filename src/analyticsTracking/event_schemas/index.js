import * as commonDefsSchema from './common_definitions.schema.json';
import * as buttonEventSchema from './BUTTON/BUTTON__EVENT.schema.json';
import * as studyListViewToggleSchema from './STUDY_LIST/STUDY_LIST__VIEW_TOGGLE.schema.json';

/** define all possible event schemas keyed by event type */
const schemas = {
  common_definitions: commonDefsSchema.default,
  BUTTON__CLICK: buttonEventSchema.default,
  BUTTON__HOVER: buttonEventSchema.default,
  MOUSE__HOVER: buttonEventSchema.default,
  STUDY_LIST__VIEW_TOGGLE: studyListViewToggleSchema.default,
};

export default schemas;
