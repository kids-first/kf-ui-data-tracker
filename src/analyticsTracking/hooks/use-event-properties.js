import React from 'react';
import {AmplitudeContext} from '../services/Amplitude/AmplitudeProvider';

export const useEventProperties = eventProperties => {
  const context = React.useContext(AmplitudeContext);

  if (typeof eventProperties === 'function') {
    return eventProperties(context.eventProperties);
  } else {
    return {
      ...context.eventProperties,
      ...eventProperties,
    };
  }
};
