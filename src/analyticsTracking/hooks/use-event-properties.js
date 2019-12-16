import React from 'react';
import {AmplitudeContext} from '../services/Amplitude/AmplitudeProvider';

export const useEventProperties = eventProperties => {
  const context = React.useContext(AmplitudeContext);

  if (typeof eventProperties === 'function') {
    return eventProperties(context.eventProperties);
  } else {
    const contextScope =
      context.eventProperties && context.eventProperties.scope
        ? context.eventProperties.scope
        : [];
    const currentScope =
      eventProperties && eventProperties.scope ? eventProperties.scope : [];
    return {
      ...context.eventProperties,
      ...eventProperties,
      /**
       * properly inheriting our 'scope' prop from context
       * this helps us having explicity inherit it every time we use the hook
       */
      scope: [...contextScope, ...currentScope],
    };
  }
};
