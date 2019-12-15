import React from 'react';
import {AmplitudeContext} from '../services/Amplitude/AmplitudeProvider';
import {useLogEvent} from './use-log-event';
import {useInstrument} from './use-instrument';

const useAnalyticsTracking = (
  eventProperties = {},
  instanceName = '$default_instance',
  opts = {},
) => {
  const {
    amplitudeInstance,
    eventProperties: inheritedProperties,
  } = React.useContext(AmplitudeContext);

  const logEvent = useLogEvent(instanceName, eventProperties, 0, opts);
  const instrument = useInstrument(instanceName, eventProperties, 0, opts);
  return React.useMemo(() => {
    return {
      logEvent: logEvent,
      instrument: instrument,
      eventProperties: inheritedProperties,
      amplitudeInstance: amplitudeInstance,
    };
  }, [
    // eventProperties,
    amplitudeInstance,
    inheritedProperties,
    // instanceName,
    logEvent,
    instrument,
  ]);
};

export default useAnalyticsTracking;
