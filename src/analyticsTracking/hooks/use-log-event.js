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
  if (['test', 'CI', 'testing'].includes(process.env.NODE_ENV)) {
    sessionStorage.setItem(
      'session_events',
      JSON.stringify([
        ...(JSON.parse(sessionStorage.getItem('session_events')) || []),
        {
          eventType: EventType,
          eventProps: EventProps,
          utc_time: Date.now(),
        },
      ]),
    );
  }
};

export const useLogEvent = (
  instanceName = '$default_instance',
  eventProperties,
  opts = {},
  debounceInterval,
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
      const inheritedScope =
        inheritedEventProperties && inheritedEventProperties.scope
          ? inheritedEventProperties.scope
          : [];
      const eventScope =
        eventProperties && eventProperties.scope ? eventProperties.scope : [];

      const EventProps = {
        ...inheritedEventProperties,
        ...(eventProperties || {}),
        /**
         * properly inheriting our scope prop from parent and grandparnet AmplitudeProxy instances
         * this helps us having explicity inherit it in every AmplitudeProxy instance
         */
        scope: [...inheritedScope, ...eventScope],
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
