import schemas from './event_schemas';

/**
 * Here we take our schema keys, which are our event types (<scope>__<action>),
 * and create a "scoped" object of event constants by breaking the event
 * names apart on the the "__" delimiter and setting the event type string constant
 * as the value and the scope as the key (scope:MOUSE + action:CLICK = MOUSE.CLICK = "MOUSE__CLICK").
 * This also adds a "scope" convenience property that reflects the scope name.
 *
 * EXAMPLE:
 *
 * ["BUTTON__HOVER","BUTTON__CLICK", "BUTTON__FOCUS"] =
 * {
 *  BUTTON:{
 *   scope: "BUTTON",
 *   HOVER: "BUTTON__HOVER",
 *   CLICK: "BUTTON__CLICK",
 *   FOCUS: "BUTTON__FOCUS",
 *  }
 * }
 */
const EVENT_CONSTANTS = Object.keys(schemas).reduce((acc, curr) => {
  const keyArr = curr.split('__');
  return {
    [keyArr[0]]: {
      scope: keyArr[0],
      [keyArr[1]]: curr,
      ...(acc[keyArr[0]] || {}),
    },
    ...acc,
  };
}, {});

export default EVENT_CONSTANTS;
