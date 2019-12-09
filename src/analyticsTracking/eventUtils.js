import EVENT_CONSTANTS from './eventConstants';

export const normalizeEventType = str =>
  str
    .trim()
    .replace(/ /gi, '_')
    .toUpperCase();

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

/**  */
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

export const popupTracking = (log = null, inheritedProps = {}) => (
  eventProps = null,
  scope,
) => {
  if (checkLogError('popupTracking', log))
    return mouseEvents(log)(
      {
        tooltip_name: eventProps.name || null,
        tooltip_content: eventProps.content || null,
        link: eventProps.link || null,
        stopPropagation: true,
        ...(inheritedProps || {}),
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
