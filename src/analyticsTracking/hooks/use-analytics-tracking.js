import React from 'react';
import {AmplitudeContext} from '../services/Amplitude/AmplitudeProvider';
import {useLogEvent} from './use-log-event';
import {useInstrument} from './use-instrument';
const useAnalyticsTracking = (
  eventProperties = {},
  instanceName = '$default_instance',
) => {
  const {
    amplitudeInstance,
    eventProperties: inheritedProperties,
  } = React.useContext(AmplitudeContext);

  // return React.useMemo(() => {
  const logEvent = useLogEvent(instanceName, eventProperties, 0);
  const instrument = useInstrument(instanceName, eventProperties, 0);
  // function logEvent(
  //   eventType,
  //   eventPropertiesIn = {},
  //   callback
  // ) {
  //   if (!amplitudeInstance) {
  //     return;
  //   }

  //   let computed = inheritedProperties;
  //   if (typeof eventProperties === "function") {
  //     computed = eventProperties(computed);
  //   } else {
  //     computed = { ...computed, ...(eventProperties || {}) };
  //   }
  //   if (typeof eventPropertiesIn === "function") {
  //     computed = eventPropertiesIn(computed);
  //   } else {
  //     computed = { ...computed, ...(eventPropertiesIn || {}) };
  //   }

  //   amplitudeInstance.logEvent(eventType, computed, callback);
  // }

  // function instrument<T extends Function>(eventType: string, func: T): T {
  //   function fn(...params: any) {
  //     const retVal = func ? func(...params) : undefined;
  //     logEvent(eventType);
  //     return retVal;
  //   }
  //   return fn as any;
  // }

  return {
    logEvent: logEvent,
    instrument: instrument,
    eventProperties: inheritedProperties,
    amplitudeInstance: amplitudeInstance,
  };
  // }, [eventProperties, amplitudeInstance, inheritedProperties, instanceName]);
};

export default useAnalyticsTracking;
