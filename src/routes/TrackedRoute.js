import React from 'react';
import PropTypes from 'prop-types';
import {Route} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import queryString from 'query-string';

/**
 * Wrap all of our routes to make them log the view and route they render
 *
 *  @event_scehma analyticsTracking/event_schemas/page/page_view.schema.json
 * */
const TrackedRoute = ({
  component,
  scope = [],
  eventProperties = {},
  disableViewEvent = false,
  render,
  ...rest
}) => {
  const eventProps = inheritedProps => {
    var eventProps = {
      ...inheritedProps,
      scope: [...(inheritedProps.scope || []), ...scope],
      study: rest.computedMatch && rest.computedMatch.params.kfId,
      path: rest.location.pathname,
    };
    if (rest.location.search) {
      eventProps = {
        ...eventProps,
        utm_source: queryString.parse(rest.location.search).utm_source,
      };
    }
    return eventProps;
  };
  return (
    <Amplitude eventProperties={inheritedProps => eventProps(inheritedProps)}>
      {({logEvent}) => (
        <>
          {render ? (
            <Route render={render} {...rest} />
          ) : (
            <Route component={component} {...rest} />
          )}
          {!disableViewEvent && logEvent('page view')}
        </>
      )}
    </Amplitude>
  );
};

TrackedRoute.propTypes = {
  /** component passed to Route */
  component: PropTypes.func,
  /** additional event properties object for events wihin the route */
  eventProperties: PropTypes.object,
  /** name of the view scope */
  scope: PropTypes.array,
  /** whether to disable evens firing on render */
  disableViewEvent: PropTypes.bool,
};

export default TrackedRoute;
