import analyticsTrackingConstants from '../common/analyticsTrackingConstants';

const EVENT_CONSTANTS = analyticsTrackingConstants;

const mouseEvents = log => (eventProps = {}) => {
  const mouseActions = {
    onClick: e => {
      if (eventProps.stopPropagation) e.stopPropagation();
      try {
        log(EVENT_CONSTANTS.MOUSE.CLICK, eventProps);
      } catch (e) {
        console.error(
          `[analytic-tracking]  ERROR mouseEvents eventType: ${
            EVENT_CONSTANTS.MOUSE.CLICK
          }`,
          e,
        );
      }
    },
    onMouseOver: e => {
      if (eventProps.stopPropagation) e.stopPropagation();
      try {
        log(EVENT_CONSTANTS.MOUSE.HOVER, eventProps);
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

/**
 * Curry'd function to ensure all button events have the
 * button_text and button_type event properties attached
 * @param {func} log - event logging function
 * @param {string} name - inner button text
 * @param {string} type - type of button ('toggle','label','icon', etc )
 * @param {object} props - additional event props to log
 */
export const buttonTracking = log => (name, type, props) =>
  mouseEvents(log)({button_text: name, button_type: type, ...props});

export const popupTracking = (log, inheritedProps) => ({name, content, link}) =>
  mouseEvents(log)({
    tooltip_name: name,
    tooltip_content: content,
    link,
    stopPropagation: true,
  });
