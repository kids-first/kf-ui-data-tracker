import React from 'react';
import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';
import useAnalyticsTracking from './useAnalyticsTracking';

const AnalyticsViewConsumer = ({
  children,
  status = 'SUCCESS',
  mountProperties,
  view,
}) => {
  const {VIEW: VIEW_SCOPE} = useAnalyticsTracking();
  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: [...inheritedProps.scope, `${VIEW_SCOPE.scope}_${view}`],
      })}
    >
      <LogOnMount
        eventType={VIEW_SCOPE.MOUNT}
        eventProperties={{
          url: window.location.pathname,
          status,
          ...mountProperties,
        }}
      />
      {children}
    </Amplitude>
  );
};

AnalyticsViewConsumer.propTypes = {
  /** view components */
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  /** view loading status */
  status: PropTypes.string,
  /** props to log on view component mount */
  mountProperties: PropTypes.object,
  /** props to log with every view event  */
  viewProperties: PropTypes.object,
  /** name of view to log in event scope as `VIEW_<view>` defautls to VIEW_<view_component_file_name> */
  view: PropTypes.string,
};

export default AnalyticsViewConsumer;
