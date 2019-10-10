import React from 'react';
import PropTypes from 'prop-types';
import {Amplitude, LogOnMount} from '@amplitude/react-amplitude';
import useAnalyticsTracking from './useAnalyticsTracking';

/**
 * View specific AmplitudeProvider consumer component to
 * log events on each view load and pass inherited props down to views
 */
const AnalyticsViewConsumer = ({
  children,
  status = 'SUCCESS',
  mountProperties,
  viewProperties,
  view,
}) => {
  const {VIEW: VIEW_SCOPE} = useAnalyticsTracking();

  let viewName = null;
  React.Children.forEach(children, c => {
    let source = c._source ? c._source.fileName.split('/') : null;
    if (source) viewName = source[source.length - 1].replace(/\..*/i, '');
  });

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: [
          ...inheritedProps.scope,
          `${VIEW_SCOPE.scope}_${view || viewName}`,
        ],
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

AnalyticsViewConsumer.PropTypes = {
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
