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
        `[analyticsTracking]  ERROR mouseEvents:on${domEvent} eventType: ${eventType}`,
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
