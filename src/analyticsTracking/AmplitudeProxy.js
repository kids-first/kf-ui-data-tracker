import {Amplitude} from '@amplitude/react-amplitude';
import {memoize} from '@amplitude/react-amplitude/src/lib/memoize';
import debounce from 'lodash.debounce';
import {normalizeEventType, buttonTracking, popupTracking} from './eventUtils';
import {EVENT_CONSTANTS} from '../analyticsTracking';
import saveSchema from './event_schemas/saveSchema';
import validate from './eventSchemaValidator';

/**
 *
 */
class AmplitudeProxy extends Amplitude {
  logToConsole = false;
  saveSchemas = false;

  constructor(props) {
    super(props);
    if (typeof props.debounceInterval === 'number') {
      this.logEvent = debounce(this.dispatch, props.debounceInterval);
    } else {
      this.logEvent = this.dispatch;
    }

    this._renderPropParams = {
      getInstance: this.getAmplitudeInstance,
      logEvent: this.logEvent,
      instrument: this.instrument,
      buttonTracking: buttonTracking(this.logEvent),
      popupTracking: popupTracking(this.logEvent),
      EVENT_CONSTANTS,
    };
  }

  __storeSesssionEvents = (eventType, eventProps) => {
    /** log all events to sessionStorage */
    sessionStorage.setItem(
      'session_events',
      JSON.stringify([
        ...(JSON.parse(sessionStorage.getItem('session_events')) || []),
        {
          eventType,
          eventProps: eventProps,
          utc_time: Date.now(),
        },
      ]),
    );
  };

  // proxy our logging calls so we can hook
  // other analytics services into it
  dispatch = (eventType, eventProps, cb) => {
    // check that eventType was given
    if (!eventType || eventType === 'undefined') {
      console.error(
        `[AmplitudProyy::dispatch] EventTypeError: No eventType given`,
      );
      return;
    }

    // make sure we're consistent with our naming
    const normalizedEventType = normalizeEventType(eventType);

    // inherit event props
    const combinedEventProps = {
      ...this.context.getAmplitudeEventProperties(),
      ...this.getAmplitudeEventProperties(),
      ...(eventProps || {}),
    };

    if (this.logToConsole || this.props.logToConsole) {
      console.log(
        `AmplitudeProxy::dispatch eventType:${normalizedEventType}`,
        combinedEventProps,
      );
    }

    /** saves the event schema as a "<event_constant>.schema.json" file for download */
    if (this.props.saveSchemas || this.saveSchemas) {
      saveSchema(normalizedEventType, combinedEventProps, cb);
    }

    /** save all events to sessionStorage for unit testing */
    if (
      ['test', 'CI'].includes(process.env.NODE_ENV) ||
      this.props.storeSessionEvents
    ) {
      this.__storeSesssionEvents(normalizedEventType, combinedEventProps);
    }

    /** Validate our events against their event props schemas (src/analyticsTracking/event_schemas) */
    const eventIsValid = validate(normalizedEventType, combinedEventProps);
    if (eventIsValid) {
      return this._makeLogEvent()(normalizedEventType, combinedEventProps, cb);
    } else {
      console.warn('[AmplitudeProxy] invalid event not fired');
      return false;
    }
  };

  instrument = memoize((eventType, func, props = {}) => {
    return (...params) => {
      const retVal = typeof func === 'function' ? func(...params) : undefined;
      this.dispatch(eventType, props);

      return retVal;
    };
  });
}

export default AmplitudeProxy;
