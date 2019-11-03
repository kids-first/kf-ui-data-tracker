import {Amplitude} from '@amplitude/react-amplitude';
import {memoize} from '@amplitude/react-amplitude/src/lib/memoize';
import debounce from 'lodash.debounce';

class AmplitudeProxy extends Amplitude {
  constructor(props) {
    super(props);

    if (typeof props.debounceInterval === 'number') {
      this.logEvent = debounce(this.dispatch, props.debounceInterval);
    } else {
      this.logEvent = this.dispatch;
    }

    this._renderPropParams = {
      logEvent: this.logEvent,
      instrument: this.instrument,
    };
  }

  // proxy our logging calls so we can hook
  // other analytics services into it
  dispatch = (eventType, eventProps, cb) => {
    console.log(`dispatch ${eventType}`, eventProps);
    return this._makeLogEvent()(
      eventType,
      {
        ...this.getAmplitudeEventProperties(),
        ...(eventProps || {}),
      },
      cb,
    );
  };

  instrument = memoize((eventType, func, props = {}) => {
    return (...params) => {
      const retVal = func ? func(...params) : undefined;

      this.dispatch(eventType, props);

      return retVal;
    };
  });
}

export default AmplitudeProxy;
