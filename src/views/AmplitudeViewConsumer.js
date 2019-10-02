import React from 'react';
import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';

const AmplitudeConsumer = ({
  children,
  status = 'SUCCESS',
  mountProps,
  view,
}) => (
  <Amplitude
    eventProperties={inheritedProps => ({
      ...inheritedProps,
      scope: [...inheritedProps.scope, view],
    })}
  >
    <LogOnMount
      eventType="view_mount"
      eventProperties={{
        url: window.location.pathname,
        status,
        ...mountProps,
      }}
    />
    {children}
  </Amplitude>
);

export default AmplitudeConsumer;
