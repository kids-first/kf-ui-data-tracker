import debounce from 'lodash.debounce';
import React from 'react';
import {useEventProperties} from './use-event-properties';
import {useInstance} from './use-instance';

export const useLogEvent = (
  instanceName,
  eventProperties,
  debounceInterval,
) => {
  const instance = useInstance(instanceName);
  const inheritedEventProperties = useEventProperties(eventProperties);

  return React.useMemo(() => {
    const logEvent = (eventType, eventProperties, callback) => {
      console.log(`logEvent: ${eventType}`, eventProperties);
      if (instance) {
        instance.logEvent(
          eventType,
          {
            ...inheritedEventProperties,
            ...(eventProperties || {}),
          },
          callback,
        );
      }
    };

    if (debounceInterval) {
      return debounce(logEvent, debounceInterval);
    } else {
      return logEvent;
    }
  }, [debounceInterval, inheritedEventProperties, instance]);
};
