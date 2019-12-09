import EVENT_CONSTANTS from './eventConstants';
/**
 * Takes non-standard event type string and
 * snake cases them
 * @param {string} str raw event type
 */
export const normalizeEventType = str =>
  str
    .trim()
    .replace(/ /gi, '_')
    .toUpperCase();

/**
 * Check that we have a legit log function to curry.
 * @todo using a typescript interface would nullify the need for this function
 * @param {string} funcName function that the log params is being checked for
 * @param {function} logFunc log param passed from closure
 */
const checkLogError = (funcName, logFunc) => {
  if (
    typeof logFunc !== 'function' ||
    logFunc === undefined ||
    logFunc === null
  ) {
    console.error(
      `[analyticsTracking]  ERROR ${funcName} must be instantiated with a "log" parameter, log param given = ${logFunc}`,
    );
    return false;
  }
  return true;
};

/**
 * Convenience function to append event constants in
 * "__CLICK", "__HOVER" or default to MOUSE__CLICK, MOUSE__HOVER
 *
 * @param {function} log curried function that logs the event to the service
 * @param {string} domEvent one of either "onClick" or "onMouseOver"
 * @param {string} eventType event constant
 * @param {object} eventProps
 * @param {object} e DOM mouse event OR react synthetic event
 */
const mouseEvent = log => (domEvent, eventType, eventProps, e) => {
  if (e && eventProps.stopPropagation) e.stopPropagation();
  delete eventProps.stopPropagation;
  let actions = {
    onClick: 'CLICK',
    onMouseOver: 'HOVER',
  };
  try {
    log(
      eventType
        ? `${normalizeEventType(eventType)}__${actions[domEvent]}`
        : EVENT_CONSTANTS.MOUSE[actions[domEvent]],
      eventProps,
    );
  } catch (e) {
    console.error(
      `[analyticsTracking]  ERROR mouseEvents:${domEvent} eventType: ${eventType}`,
      eventProps,
      e,
    );
  }
};

/**
 * Convenience function to that returns common DOM mouse events.
 *
 * @param {function} log function to puash events to analytics service
 */
export const mouseEvents = log => (eventProps = {}, eventType = null) => {
  if (checkLogError('mouseEvents', log))
    return {
      onClick: e => mouseEvent(log)('onClick', eventType, eventProps, e),
      onMouseOver: e =>
        mouseEvent(log)('onMouseOver', eventType, eventProps, e),
    };

  return false;
};

/**
 * Curry'd function to ensure all button events have the
 * button_text and button_type event properties attached.
 *
 * USAGE:
 * <button {...buttonTracking({link: '', button_text:''}, "My Button")} />
 * -> MY_BUTTON__CLICK:{link: '', button_text:''}
 * -> MY_BUTTON__HOVER:{link: '', button_text:''}
 *
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

/**
 * Convenience function to log common mouse events prepending "TOOLTIP__" for
 * toolip and semantic Popup components
 *
 * @param {func} log - event logging function
 * @param {object} eventProps - additional event props to log
 * @param {string} scope - optional: string constant override for event type
 */
export const popupTracking = (log = null) => (eventProps = null, scope) => {
  if (checkLogError('popupTracking', log))
    return mouseEvents(log)(
      {
        tooltip_name: eventProps.name || null,
        tooltip_content: eventProps.content || null,
        link: eventProps.link || null,
        stopPropagation: true,
      },
      scope
        ? normalizeEventType(scope)
        : eventProps
        ? `${EVENT_CONSTANTS.TOOLTIP.scope}__${normalizeEventType(
            eventProps.name,
          )}`
        : null,
    );

  return false;
};

/**
 * Convenience function to log common onOpen, onClose, onChange events
 * for dropdown components
 *
 *
 * @param {func} log - event logging function
 * @param {string} name - placeholder text used to uniquely identify a dropdown
 * @param {object} eventProps - event properites to log (placeholder and value are required)
 */
export const dropdownTracking = log => (
  name,
  eventProps = {},
  eventType = null,
) => {
  if (checkLogError('dropdownTracking', log)) {
    const dropdownEvent = action =>
      log(
        eventType
          ? `${normalizeEventType(eventType)}__${action}`
          : name
          ? `DROPDOWN__${normalizeEventType(name)}__${action}`
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
            ? `DROPDOWN__${normalizeEventType(name)}__CHANGE`
            : EVENT_CONSTANTS.DROPDOWN.CHANGE,
          {
            placeholder: name,
            value: value || (e & e.target ? e.target.value : null),
            ...eventProps,
          },
        );
      },
    };
    return dropdownEvents;
  }
  return false;
};
