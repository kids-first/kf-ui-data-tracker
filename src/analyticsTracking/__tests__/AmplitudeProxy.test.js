import React from 'react';
import debounce from 'lodash.debounce';
import {render, cleanup, act} from 'react-testing-library';
import amplitude from 'amplitude-js';
import AnalyticsProviderMock from '../AnalyticsProviderMock';
import AmplitudeProxy from '../AmplitudeProxy';

jest.useFakeTimers();

afterEach(cleanup);
beforeEach(() => {
  sessionStorage.clear();
  sessionStorage.setItem.mockClear();
});
/** mock out lodash debounced used in the Amplitude class.
 * This is a parsed down version of the robust Lodash debounce function
 */
jest.mock('lodash.debounce', () => {
  return jest.fn().mockImplementation((callback, timeout) => {
    let timeoutId = null;
    const debounced = jest.fn((...params) => {
      global.clearTimeout(timeoutId);
      timeoutId = global.setTimeout(() => {
        callback(...params);
      }, timeout);
    });

    const cancel = jest.fn(() => {
      global.clearTimeout(timeoutId);
    });

    debounced.cancel = cancel;
    return debounced;
  });
});

describe('AmplitudeProxy class', () => {
  const mockEvent = ['LOG_TEST', {foo: 'bar'}];
  const testEvents = [
    {
      eventType: mockEvent[0],
      eventProps: {
        ...mockEvent[1],
        // scope, path, and utc_time are inherited
        scope: ['TEST'],
        path: '/',
      },
      utc_time: 1556044228000,
    },
  ];

  it('should instantiate without error', () => {
    const tree = render(
      <AnalyticsProviderMock>
        <AmplitudeProxy />
      </AnalyticsProviderMock>,
    );
  });

  it('should use default amplitude instance', () => {
    const inst = amplitude.getInstance();
    const tree = render(
      <AnalyticsProviderMock>
        <AmplitudeProxy>
          {({getInstance}) => {
            const instance = getInstance();
            expect(instance._instanceName).toBe(inst._instanceName);
            return <></>;
          }}
        </AmplitudeProxy>
      </AnalyticsProviderMock>,
    );
  });

  it('should call logEvent with inherited scope property', () => {
    render(
      <AnalyticsProviderMock>
        <AmplitudeProxy>
          {({logEvent}) => {
            logEvent(...mockEvent);

            /**  events to sessionStorage in test environment */
            expect(sessionStorage.setItem).toHaveBeenCalledTimes(1);

            // check that our event is in the session_events
            // user toContainEqual because JSON stringify
            // is not deterministic
            expect(
              JSON.parse(sessionStorage.__STORE__['session_events']),
            ).toContainEqual(testEvents[0]);

            expect(Object.keys(sessionStorage.__STORE__).length).toBe(1);

            expect(
              JSON.parse(sessionStorage.__STORE__['session_events']).length,
            ).toBe(1);
            return <></>;
          }}
        </AmplitudeProxy>
      </AnalyticsProviderMock>,
    );
  });

  it('should debounce logEvent by debounceInterval prop when set', () => {
    const mockCallback = jest.fn();
    render(
      <AnalyticsProviderMock>
        {/* set to debounce events every 1sec */}
        <AmplitudeProxy debounceInterval={1000}>
          {({logEvent}) => {
            // Call it immediately
            logEvent(...[...mockEvent, mockCallback]);

            /**  events to sessionStorage in test environment */
            expect(sessionStorage.setItem).toHaveBeenCalledTimes(0);

            // test that debounce was called
            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenLastCalledWith(
              expect.any(Function),
              1000,
            );

            // Call it several times with 500ms between each call
            for (let i = 0; i < 5; i++) {
              jest.advanceTimersByTime(500);
              logEvent(mockEvent[0], {foo: `bar-${i}`});
            }

            /**  test it was not prematurely called */
            expect(sessionStorage.setItem).toHaveBeenCalledTimes(0);

            // wait for the debounce 1000ms interval to pass
            jest.advanceTimersByTime(1000);

            // should have logged through dispatch method
            expect(sessionStorage.setItem).toHaveBeenCalledTimes(1);
            expect(Object.keys(sessionStorage.__STORE__).length).toBe(1);

            // should only be one event in the session_logs
            expect(
              JSON.parse(sessionStorage.__STORE__['session_events']).length,
            ).toBe(1);
            /**
             * check that our last event dispatched from the loop is in the session_events
             * use toContainEqual because JSON stringify is not deterministic
             */
            expect(
              JSON.parse(sessionStorage.__STORE__['session_events']),
            ).toContainEqual({
              eventType: mockEvent[0],
              eventProps: {
                foo: 'bar-4',
                // scope, path, and utc_time are inherited
                scope: ['TEST'],
                path: '/',
              },
              utc_time: 1556044228000,
            });

            return <></>;
          }}
        </AmplitudeProxy>
      </AnalyticsProviderMock>,
    );
  });

  it('should call instrument method and curry the function', () => {
    /** setup mock function to curry  */
    const mockEventPropFunc = jest.fn(testObj => JSON.stringify(testObj));
    render(
      <AnalyticsProviderMock>
        <AmplitudeProxy>
          {({instrument}) => {
            /** test that currying of functions works  */
            const onClick = instrument(
              mockEvent[0],
              mockEventPropFunc,
              mockEvent[1],
            );
            onClick({foo: 'bar', baz: 'bash', a: 1});
            // test that it curried our function through
            expect(mockEventPropFunc).toHaveBeenCalledTimes(1);
            expect(mockEventPropFunc).toHaveBeenCalledWith({
              foo: 'bar',
              baz: 'bash',
              a: 1,
            });

            /**  events to sessionStorage in test environment */
            expect(sessionStorage.setItem).toHaveBeenCalledTimes(1);
            /**
             * check that our event is in the session_events
             * user toContainEqual because JSON stringify is not deterministic
             */

            expect(
              JSON.parse(sessionStorage.__STORE__['session_events']),
            ).toContainEqual(testEvents[0]);

            expect(Object.keys(sessionStorage.__STORE__).length).toBe(1);

            expect(
              JSON.parse(sessionStorage.__STORE__['session_events']).length,
            ).toBe(1);

            return <></>;
          }}
        </AmplitudeProxy>
      </AnalyticsProviderMock>,
    );
  });
});
