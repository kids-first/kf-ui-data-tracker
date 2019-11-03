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

export const buttonTracking = log => {
  return mouseEvents(log);
};

export const popupTracking = (log, inheritedProps) => ({
  name,
  content,
  link,
}) => ({
  ...mouseEvents(log)({
    tooltip_name: name,
    tooltip_content: content,
    link,
    scope: `TOOLTIP_${name}`,
    stopPropagation: true,
  }),
});
