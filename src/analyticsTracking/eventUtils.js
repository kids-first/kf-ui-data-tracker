import analyticsTrackingConstants from '../common/analyticsTrackingConstants';

const EVENT_CONSTANTS = analyticsTrackingConstants;
const normalizeEventType = str =>
  str
    .replace(/ /gi, '_')
    .toUpperCase()
    .trim();

export const mouseEvents = log => (eventProps = {}, eventType = null) => {
  if (typeof log !== 'function') {
    console.error(
      `[analytic-tracking]  ERROR mouseEvents must be instantiated with a "log" parameter, log param given = ${log}`,
    );
    return false;
  }
  const mouseActions = {
    onClick: e => {
      if (e && eventProps.stopPropagation) e.stopPropagation();
      delete eventProps.stopPropagation;
      try {
        log(
          eventType ? `${eventType}_CLICK` : EVENT_CONSTANTS.MOUSE.CLICK,
          eventProps,
        );
      } catch (e) {
        console.error(
          `[analytic-tracking]  ERROR mouseEvents:onClick eventType: ${eventType}`,
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
          eventType ? `${eventType}_HOVER` : EVENT_CONSTANTS.MOUSE.HOVER,
          eventProps,
        );
      } catch (e) {
        console.error(
          `[analytic-tracking] ERROR mouseEvents eventType: ${
            EVENT_CONSTANTS.MOUSE.HOVER
          }`,
          e,
        );
      }
    },
  };

  return mouseActions;
};

//@TODO: make input events

export const dropdownEvents = log => (
  name,
  eventProps = {},
  eventType = null,
) => ({
  onOpen: () => {
    log(
      eventType
        ? `${normalizeEventType(eventType)}_OPEN`
        : name
        ? `DROPDOWN_${normalizeEventType(name)}__OPEN`
        : EVENT_CONSTANTS.DROPDOWN.OPEN,
      {placeholder: name, ...eventProps},
    );
  },
  onClose: () => {
    log(
      eventType
        ? `${normalizeEventType(eventType)}_CLOSE`
        : name
        ? `DROPDOWN_${normalizeEventType(name)}__CLOSE`
        : EVENT_CONSTANTS.DROPDOWN.OPEN,
      {placeholder: name, ...eventProps},
    );
  },
  onChange: (e, {value}) => {
    log(
      eventType
        ? `${normalizeEventType(eventType)}_CHANGE`
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
});

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
    scope ? `${scope.toUpperCase()}_` : null,
  );

export const popupTracking = (log, inheritedProps) => (
  {name, content, link},
  scope,
) =>
  mouseEvents(log)(
    {
      tooltip_name: name,
      tooltip_content: content,
      link,
      stopPropagation: true,
      ...inheritedProps,
    },
    scope ||
      `${EVENT_CONSTANTS.TOOLTIP.scope}${
        typeof name == 'string' ? '_' + name.toUpperCase() : null
      }_`,
  );
