import analyticsTrackingConstants from '../common/analyticsTrackingConstants';

const EVENT_CONSTANTS = analyticsTrackingConstants;
export const normalizeEventType = str =>
  str
    .trim()
    .replace(/ /gi, '_')
    .toUpperCase();

export const mouseEvents = log => (eventProps = {}, eventType = null) => {
  if (typeof log !== 'function') {
    console.error(
      `[analyticsTracking]  ERROR mouseEvents must be instantiated with a "log" parameter, log param given = ${log}`,
    );
    return false;
  }
  const mouseActions = {
    onClick: e => {
      if (e && eventProps.stopPropagation) e.stopPropagation();
      delete eventProps.stopPropagation;
      try {
        log(
          eventType
            ? `${normalizeEventType(eventType)}__CLICK`
            : EVENT_CONSTANTS.MOUSE.CLICK,
          eventProps,
        );
      } catch (e) {
        console.error(
          `[analyticsTracking]  ERROR mouseEvents:onClick eventType: ${eventType}`,
          eventProps,
          e,
        );
      }
    },
    onMouseOver: e => {
      if (e && eventProps.stopPropagation) e.stopPropagation();
      delete eventProps.stopPropagation;
      try {
        log(
          eventType
            ? `${normalizeEventType(eventType)}__HOVER`
            : EVENT_CONSTANTS.MOUSE.HOVER,
          eventProps,
        );
      } catch (e) {
        console.error(
          `[analyticsTracking] ERROR mouseEvents:onMouseHover eventType: ${eventType}`,
          eventProps,
          e,
        );
      }
    },
  };

  return mouseActions;
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
  const dropdownEvents = {
    onOpen: () => {
      log(
        eventType
          ? `${normalizeEventType(eventType)}__OPEN`
          : name
          ? `DROPDOWN_${normalizeEventType(name)}__OPEN`
          : EVENT_CONSTANTS.DROPDOWN.OPEN,
        {placeholder: name, ...eventProps},
      );
    },
    onClose: () => {
      log(
        eventType
          ? `${normalizeEventType(eventType)}__CLOSE`
          : name
          ? `DROPDOWN_${normalizeEventType(name)}__CLOSE`
          : EVENT_CONSTANTS.DROPDOWN.OPEN,
        {placeholder: name, ...eventProps},
      );
    },
    onChange: (e, {value}) => {
      log(
        eventType
          ? `${normalizeEventType(eventType)}__CHANGE`
          : name
          ? `DROPDOWN_${normalizeEventType(name)}__CHANGE`
          : EVENT_CONSTANTS.DROPDOWN.OPEN,
        {
          placehodler: name,
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
      : `${EVENT_CONSTANTS.TOOLTIP.scope}${
          typeof scope == 'string' || typeof eventProps.name == 'string'
            ? '__' + normalizeEventType(scope || eventProps.name)
            : null
        }`,
  );
