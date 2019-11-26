import {EVENT_CONSTANTS} from './index';

/**
 * Sanitize our event names in a consistent way
 * @param {string} str Event name
 * @return {string} <scope>__<action>
 */
export const normalizeEventType = str =>
  str
    .trim()
    .replace(/ /gi, '_')
    .toUpperCase();

/**
 * Convenience methods for common mouse interaction events
 * @param {function} log Event emitter function to log events
 * @param {object} eventProps  Event properties object, should conform to the json schema for the given event type
 * @param {string} eventType  String constant of format "<scope>__<action>"
 */
export const mouseEvents = log => (eventProps = {}, eventType = null) => {
  if (typeof log !== 'function') {
    console.error(
      `[analyticsTracking]  ERROR mouseEvents must be instantiated with a "log" parameter, "log" param given = ${log}`,
    );
    return false;
  }

  /**
   * Logs a MOUSE__<action> event
   * @param {object} param0 Event payload containing the MOUSE action and DOM event
   * @param {object} e  DOM event object, for React it will be a synthentic event (https://reactjs.org/docs/events.html)
   */
  const mouseEvent = ({action, domEvent}, e) => {
    if (e && eventProps.stopPropagation) e.stopPropagation();
    delete eventProps.stopPropagation;
    try {
      log(
        eventType
          ? `${normalizeEventType(eventType)}__${action}`
          : EVENT_CONSTANTS.MOUSE[action],
        eventProps,
      );
    } catch (e) {
      console.error(
        `[analyticsTracking]  ERROR: mouseEvent:${domEvent} eventType: ${eventType}`,
        eventProps,
        e,
      );
    }
  };

  return {
    onClick: e => mouseEvent({action: 'CLICK', domEvent: 'onClick'}, e),
    onMouseOver: e => mouseEvent({action: 'HOVER', domEvent: 'onMouseOver'}, e),
  };
};

//@TODO: make input events

export const dropdownTracking = log => (
  name,
  eventProps = {},
  eventType = null,
) => {
  if (typeof log !== 'function') {
    console.error(
      `[analyticsTracking]  ERROR dropdownTracking must be instantiated with a "log" parameter, log param given = ${log}`,
    );
    return false;
  }
  const dropdownEvent = action =>
    log(
      eventType
        ? `${normalizeEventType(eventType)}__${action}`
        : name
        ? `DROPDOWN_${normalizeEventType(name)}__${action}`
        : EVENT_CONSTANTS.DROPDOWN[action],
      {placeholder: name, ...eventProps},
    );
  const dropdownEvents = {
    onOpen: () => dropdownEvent('OPEN'),
    onClose: () => dropdownEvent('CLOSE'),
    onChange: (e, {value}) => {
      log(
        eventType
          ? `${normalizeEventType(eventType)}__CHANGE`
          : name
          ? `DROPDOWN_${normalizeEventType(name)}__CHANGE`
          : EVENT_CONSTANTS.DROPDOWN__CHANGE,
        {
          placeholder: name,
          value: value || (e & e.target ? e.target.value : null),
          ...eventProps,
        },
      );
    },
  };
  return dropdownEvents;
};

/**
 * Curry'd function to ensure all button events have the
 * button_text and button_type event properties attached
 * @param {func} log - event logging function
 * @param {string} name - inner button text
 * @param {string} type - type of button ('toggle','label','icon', etc )
 * @param {object} props - additional event props to log
 */
export const buttonTracking = log => (name, type, props, scope) =>
  mouseEvents(log)(
    {button_text: name, button_type: type, ...props},
    scope ? `${normalizeEventType(scope)}` : null,
  );

export const popupTracking = (log, inheritedProps = {}) => (
  eventProps = {},
  scope,
) =>
  mouseEvents(log)(
    {
      tooltip_name: eventProps.name || null,
      tooltip_content: eventProps.content || null,
      link: eventProps.link || null,
      stopPropagation: true,
      ...(inheritedProps || {}),
    },
    scope
      ? normalizeEventType(scope)
      : `${EVENT_CONSTANTS.TOOLTIP}${
          typeof scope == 'string' || typeof eventProps.name == 'string'
            ? '__' + normalizeEventType(scope || eventProps.name)
            : null
        }`,
  );
