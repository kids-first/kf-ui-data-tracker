import {Amplitude} from '@amplitude/react-amplitude';
import {memoize} from '@amplitude/react-amplitude/src/lib/memoize';
import debounce from 'lodash.debounce';
import {buttonTracking} from './eventUtils';
import {EVENT_CONSTANTS} from '../analyticsTracking';

/**
 *
 */
class AmplitudeProxy extends Amplitude {
  logToConsole = false;

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
      EVENT_CONSTANTS,
      buttonTracking: buttonTracking(this.logEvent),
    };
  }

  // proxy our logging calls so we can hook
  // other analytics services into it
  dispatch = (eventType, eventProps, cb) => {
    if (this.logToConsole || this.props.logToConsole) {
      console.log(
        `AmplitudeProxy::dispatch eventType:${eventType}`,
        eventProps,
      );
    }

    const combinedEventProps = {
      ...this.getAmplitudeEventProperties(),
      ...(eventProps || {}),
    };

    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'CI' ||
      this.props.storeSessionEvents
    ) {
      /** log all events to sessionStorage */
      sessionStorage.setItem(
        'session_events',
        JSON.stringify([
          ...(JSON.parse(sessionStorage.getItem('session_events')) || []),
          {
            eventType,

            eventProps: combinedEventProps,
            utc_time: Date.now(),
          },
        ]),
      );
    }

    return this._makeLogEvent()(eventType, combinedEventProps, cb);
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
