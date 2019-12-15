import React from 'react';
import {AmplitudeContext} from '../services/Amplitude/AmplitudeProvider';
import {useLogEvent} from './use-log-event';
import {useInstrument} from './use-instrument';

const useAnalyticsTracking = (
  eventProperties = {},
  opts = {},
  instanceName = '$default_instance',
) => {
  const {
    amplitudeInstance,
    eventProperties: inheritedProperties,
  } = React.useContext(AmplitudeContext);

  const logEvent = useLogEvent(instanceName, eventProperties, opts, 0);
  const instrument = useInstrument(instanceName, eventProperties, opts, 0);
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
