import * as commonDefsSchema from './common_defs.schema.json';
import * as authLoginSchema from './AUTH/AUTH__LOGIN.schema.json';
import * as pageViewSchema from './PAGE/PAGE__VIEW.schema.json';
import * as buttonEventSchema from './BUTTON/BUTTON_EVENT.schema.json';
import * as tooltipEventSchema from './TOOLTIP/TOOLTIP_EVENT.schema.json';
// list events
import {LIST__PAGINATE, INPUT__TEXT, SORT_DIRECTION__CLICK} from './LIST';
import {
  DROPDOWN_EVENT,
  DROPDOWN__OPEN,
  DROPDOWN__CLOSE,
  DROPDOWN__CHANGE,
} from './DROPDOWN';

import {DRAG__DROP, DRAG__ENTER, DRAG__LEAVE} from './DRAG_AND_DROP';

import {
  STUDY_LIST__VIEW_TOGGLE,
  STUDY_LIST__ADD_STUDY,
  STUDY_LIST__SEARCH,
} from './STUDY_LIST';

import {
  STUDY_CARD__TOGGLE_DETAIL,
  STUDY_CARD__TOOLTIP_FILES__CLICK,
  STUDY_CARD__TOOLTIP_INFO__CLICK,
  STUDY_CARD__TOOLTIP_PROJECTS__CLICK,
} from './STUDY_CARD';

import {
  UPLOAD_DOCUMENT__CLICK,
  UPLOAD,
  DELETE_FILE__CLICK,
  DELETE_FILE__HOVER,
  TOOLTIP__COPY_DOWNLOAD_LINK__HOVER,
  TOOLTIP__DELETE_CONFIRM__HOVER,
  TOOLTIP__DOWNLOAD_LATEST_VERSION__HOVER,
  FILE_STATUS_BADGE__HOVER,
  FILE_ELEMENT__CLICK,
} from './STUDY_FILES_LIST';

/**
 * List of all possible analytics event types associated with
 * their validating json schema.
 *
 * Schema keys coorespond to specific events types and should
 * be in the format of <scope>__<action>, with a em dash delimeter.
 *
 * <scope> is the specific UI/application area the event«
 * was fired from (STUDY_LIST, BUTTON, STUDY_CARD, etc.)
 *
 * <action> is the especifc event that was performed within that scope
 * (CLICK, HOVER, SEARCH, etc)PE
 *
 * Schema keys then get translated into event constants in src/analtyicsTracking/index.js
 */
const schemas = {
  LOG_TEST: {description: 'sent in test and ci environments', $id: 'LOG_TEST'},
  common_defs: commonDefsSchema.default,
  // page view
  PAGE__VIEW: pageViewSchema.default,
  // mouse
  MOUSE__CLICK: {no: 'event props', $id: 'MOUSE__CLICK'},
  MOUSE__HOVER: {no: 'event props', $id: 'MOUSE__HOVER'},
  // dropdown
  DROPDOWN_EVENT: DROPDOWN_EVENT,
  DROPDOWN__OPEN: {no: 'event props'},
  DROPDOWN__CLOSE: {no: 'event props'},
  DROPDOWN__CHANGE: {no: 'event props'},
  // drag and drop
  DRAG__DROP: DRAG__DROP,
  DRAG__ENTER: DRAG__ENTER,
  DRAG__LEAVE: DRAG__LEAVE,
  // auth
  AUTH__LOGIN: authLoginSchema.default,
  AUTH__LOGOUT: {no: 'event props', $id: 'AUTH__LOGOUT'},
  //button
  BUTTON_DEFINITIONS: buttonEventSchema.default,
  BUTTON__CLICK: {...buttonEventSchema.default, $id: 'BUTTON__CLICK'},
  BUTTON__HOVER: {...buttonEventSchema.default, $id: 'BUTTON__HOVER'},
  //tooltip/popup
  TOOLTIP_EVENT: tooltipEventSchema.default,
  // list
  LIST__PAGINATE: LIST__PAGINATE,
  INPUT__TEXT: INPUT__TEXT,
  SORT_DIRECTION__CLICK: SORT_DIRECTION__CLICK,
  // study list view
  STUDY_LIST__VIEW_TOGGLE: STUDY_LIST__VIEW_TOGGLE,
  STUDY_LIST__ADD_STUDY: STUDY_LIST__ADD_STUDY,
  STUDY_LIST__SEARCH: STUDY_LIST__SEARCH,
  // study card
  STUDY_CARD__TOGGLE_DETAIL: STUDY_CARD__TOGGLE_DETAIL,
  STUDY_CARD__TOOLTIP_FILES__CLICK: STUDY_CARD__TOOLTIP_FILES__CLICK,
  STUDY_CARD__TOOLTIP_INFO__CLICK: STUDY_CARD__TOOLTIP_INFO__CLICK,
  STUDY_CARD__TOOLTIP_PROJECTS__CLICK: STUDY_CARD__TOOLTIP_PROJECTS__CLICK,
  // study docs list
  FILE_ELEMENT__CLICK: FILE_ELEMENT__CLICK,
  FILE_STATUS_BADGE__HOVER: FILE_STATUS_BADGE__HOVER,
  FILE_STATUS_BADGE__CLICK: FILE_STATUS_BADGE__CLICK,
  UPLOAD_DOCUMENT__CLICK: UPLOAD_DOCUMENT__CLICK,
  UPLOAD: UPLOAD,
  DELETE_FILE__CLICK: DELETE_FILE__CLICK,
  DELETE_FILE__HOVER: DELETE_FILE__HOVER,
  TOOLTIP__COPY_DOWNLOAD_LINK__HOVER: TOOLTIP__COPY_DOWNLOAD_LINK__HOVER,
  TOOLTIP__COPY_DOWNLOAD_LINK__CLICK: {
    ...TOOLTIP__COPY_DOWNLOAD_LINK__HOVER,
    $id: 'TOOLTIP__COPY_DOWNLOAD_LINK__CLICK',
  },
  TOOLTIP__DELETE_CONFIRM__HOVER: TOOLTIP__DELETE_CONFIRM__HOVER,
  TOOLTIP__DELETE_CONFIRM__CLICK: {
    ...TOOLTIP__DELETE_CONFIRM__HOVER,
    $id: 'TOOLTIP__DELETE_CONFIRM__CLICK',
  },
  TOOLTIP__DOWNLOAD_LATEST_VERSION__HOVER: TOOLTIP__DOWNLOAD_LATEST_VERSION__HOVER,
  TOOLTIP__DOWNLOAD_LATEST_VERSION__CLICK: {
    ...TOOLTIP__DOWNLOAD_LATEST_VERSION__HOVER,
    $id: 'TOOLTIP__DOWNLOAD_LATEST_VERSION__CLICK',
  },
  // Study docs list filter
  DROPDOWN__APPROVAL_STAUTS__OPEN: {
    ...DROPDOWN__OPEN,
    $id: 'DROPDOWN__APPROVAL_STAUTS__OPEN',
  },
  DROPDOWN__APPROVAL_STAUTS__CLOSE: {
    ...DROPDOWN__CLOSE,
    $id: 'DROPDOWN__APPROVAL_STAUTS__CLOSE',
  },
  DROPDOWN__APPROVAL_STATUS__CHANGE: {
    ...DROPDOWN__CHANGE,
    $id: 'DROPDOWN__APPROVAL_STATUS__CHANGE',
  },
  DROPDOWN__FILE_TYPE__OPEN: {
    ...DROPDOWN__OPEN,
    $id: 'DROPDOWN__FILE_TYPE__OPEN',
  },
  DROPDOWN__FILE_TYPE__CLOSE: {
    ...DROPDOWN__CLOSE,
    $id: 'DROPDOWN__FILE_TYPE__CLOSE',
  },
  DROPDOWN__FILE_TYPE__CHANGE: {
    ...DROPDOWN__CHANGE,
    $id: 'DROPDOWN__FILE_TYPE__CHANGE',
  },
  DROPDOWN__DATE_OPTION__OPEN: {
    ...DROPDOWN__OPEN,
    $id: 'DROPDOWN__DATE_OPTION__OPEN',
  },
  DROPDOWN__DATE_OPTION__CLOSE: {
    ...DROPDOWN__CLOSE,
    $id: 'DROPDOWN__DATE_OPTION__CLOSE',
  },
  DROPDOWN__DATE_OPTION__CHANGE: {
    ...DROPDOWN__CHANGE,
    $id: 'DROPDOWN__DATE_OPTION__CHANGE',
  },
};

export default schemas;
