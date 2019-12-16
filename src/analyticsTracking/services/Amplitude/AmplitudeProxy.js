import React from 'react';
import PropTypes from 'prop-types';

import {AmplitudeContext} from './AmplitudeProvider';
import {useInstrument} from '../../hooks/use-instrument';
import {useLogEvent} from '../../hooks/use-log-event';
import {useInstance} from '../../hooks/use-instance';
import EVENT_CONSTANTS from '../../eventConstants';

const AmplitudeProxy = ({
  children,
  debounceInterval,
  eventProperties,
  instanceName = '$default_instance',
  userProperties,
  options = {},
}) => {
  const logEvent = useLogEvent(
    instanceName,
    eventProperties,
    options,
    debounceInterval,
  );
  const instrument = useInstrument(
    instanceName,
    eventProperties,
    debounceInterval,
  );
  const getInstance = useInstance(instanceName);

  // useSetUserProperties(instanceName, userProperties);

  const inheritedContext = React.useContext(AmplitudeContext);

  const contextValue = React.useMemo(() => {
    const inheritedScope =
      inheritedContext.eventProperties && inheritedContext.eventProperties.scope
        ? inheritedContext.eventProperties.scope
        : [];
    const currentScope =
      eventProperties && eventProperties.scope ? eventProperties.scope : [];

    return {
      ...inheritedContext,
      eventProperties: {
        ...inheritedContext.eventProperties,
        ...eventProperties,
        /**
         * properly inheriting our scope prop from context
         * this helps us having explicity inherit it in every AmplitudeProxy instance
         */
        scope: [...inheritedScope, ...currentScope],
      },
    };
  }, [eventProperties, inheritedContext]);

  let childElements;

  if (typeof children === 'function') {
    childElements = children({
      instrument,
      logEvent,
      AmplitudeInstance: getInstance,
      EVENT_CONSTANTS,
    });
  } else {
    childElements = children || null;
  }

  return (
    <AmplitudeContext.Provider value={contextValue}>
      {childElements}
    </AmplitudeContext.Provider>
  );
};

AmplitudeProxy.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  eventProperties: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  debounceInterval: PropTypes.number,
  instanceName: PropTypes.string,
  userProperties: PropTypes.object,
};

export default AmplitudeProxy;
