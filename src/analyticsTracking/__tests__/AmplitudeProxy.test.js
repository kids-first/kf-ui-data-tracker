import React from 'react';
import {render, cleanup} from 'react-testing-library';
import amplitude from 'amplitude-js';
import AnalyticsProviderMock from '../AnalyticsProviderMock';
import AmplitudeProxy from '../AmplitudeProxy';

afterEach(cleanup);
beforeEach(() => {
  sessionStorage.clear();
  sessionStorage.setItem.mockClear();
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
