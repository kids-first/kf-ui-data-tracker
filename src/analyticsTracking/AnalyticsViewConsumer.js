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

  const viewName = [];
  React.Children.forEach(children, c => {
    let source = c._source.fileName.split('/');
    viewName.push(source[source.length - 1].replace(/\..*/i, ''));
  });

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: [
          ...inheritedProps.scope,
          `${VIEW_SCOPE.scope}_${view || viewName[0]}`,
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

export default AnalyticsViewConsumer;
