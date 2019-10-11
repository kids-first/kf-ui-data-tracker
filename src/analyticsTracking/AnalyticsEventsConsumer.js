import React from 'react';
import {Amplitude} from '@amplitude/react-amplitude';
import useAnalyticsTracking from './useAnalyticsTracking';

const AnalyticsEventsConsumer = ({children, eventProps}) => {
  const analyticsConstants = useAnalyticsTracking();

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        ...eventProps,
      })}
    >
      {props => {
        const buttonTrackingProps = buttonName => ({
          onClick: e =>
            props.logEvent(analyticsConstants.MOUSE.CLICK, {
              button_name: buttonName,
            }),
          onMouseEnter: e =>
            props.logEvent(analyticsConstants.MOUSE.HOVER, {
              button_name: buttonName,
            }),
        });
        if (typeof children === 'function') {
          return children({...props, buttonTrackingProps, analyticsConstants});
        } else {
          return children || null;
        }
      }}
    </Amplitude>
  );
};

export default AnalyticsEventsConsumer;
