import React from 'react';
import {useLogEvent} from './use-log-event';

export const useInstrument = (
  instanceName,
  eventProperties,
  debounceInterval,
) => {
  const logEvent = useLogEvent(instanceName, eventProperties, debounceInterval);

  return React.useCallback(
    function instrument(eventType, func, eventProps) {
      return function instrumentedFunc(...params) {
        const retVal = func ? func.apply(this, params) : undefined;
        /** enchace our log call by passing event props  */
        logEvent(eventType, {...eventProperties, ...eventProps});

        return retVal;
      };
    },
    [logEvent],
  );
};
