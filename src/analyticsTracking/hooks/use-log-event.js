import React from 'react';
import debounce from 'lodash.debounce';
import {useEventProperties} from './use-event-properties';
import {useInstance} from './use-instance';
import {normalizeEventType} from '../eventUtils';
import saveSchema from '../saveSchema';
import validate from '../eventSchemaValidator';

const logEventToConsole = (EventType, eventProps, opts) => {
  if (opts.logToConsole) {
    console.log(`logEvent: ${EventType}`, eventProps);
  }
};

const saveSchemaToLocalFile = (EventType, EventProps, opts) => {
  /** saves the event schema as a "<event_constant>.schema.json" file for download */
  if (
    ['dev', 'development'].includes(process.env.NODE_ENV) &&
    opts.saveSchemas
  ) {
    saveSchema(EventType, EventProps);
  }
};

const saveEventToSessionStorage = (EventType, EventProps) => {
  /** save all events to sessionStorage for unit testing */
  if (['test', 'CI'].includes(process.env.NODE_ENV)) {
    /** log all events to sessionStorage */
    sessionStorage.setItem(
      'session_events',
      JSON.stringify([
        ...(JSON.parse(sessionStorage.getItem('session_events')) || []),
        {
          EventType,
          eventProps: EventProps,
          utc_time: Date.now(),
        },
      ]),
    );
  }
};

export const useLogEvent = (
  instanceName,
  eventProperties,
  debounceInterval,
  opts = {},
) => {
  const instance = useInstance(instanceName);
  const inheritedEventProperties = useEventProperties(eventProperties);

  return React.useMemo(() => {
    const logEvent = (eventType, eventProperties, callback) => {
      if (!eventType || eventType === 'undefined') {
        console.error(`EventTypeError: No eventType given`);
        return false;
      }
      // make sure we're consistent with our naming
      const EventType = normalizeEventType(eventType);
      const EventProps = {
        ...inheritedEventProperties,
        ...(eventProperties || {}),
      };

      logEventToConsole(EventType, EventProps, opts);

      saveSchemaToLocalFile(EventType, EventProps, opts);

      saveEventToSessionStorage(EventType, EventProps);

      /** Validate our events against their event props schemas (src/analyticsTracking/event_schemas) */
      const eventIsValid = validate(EventType, EventProps);

      if (instance && eventIsValid) {
        instance.logEvent(EventType, EventProps, callback);
      }
    };

    if (debounceInterval) {
      return debounce(logEvent, debounceInterval);
    } else {
      return logEvent;
    }
  }, [debounceInterval, inheritedEventProperties, instance, opts]);
};
