import {normalizeEventType, mouseEvents} from '../eventUtils';
import {cleanup} from 'react-testing-library';

/**
 *
 * @TODO: make this more DRY since most of the events
 * are based on the mouseEvents
 *
 */

afterEach(cleanup);

const mockLogger = jest.fn();
beforeEach(() => {
  mockLogger.mockClear();
});
describe('analyticsTracking eventUtils', () => {
  describe('normalizeEventType', () => {
    it('should trim, capitalize, and snake case string input', () => {
      expect(normalizeEventType(' foo bar bazBas_h h')).toBe(
        'FOO_BAR_BAZBAS_H_H',
      );
    });
  }); // end normalizeEventType
  describe('mouseEvents', () => {
    describe('onClick', () => {
      const mockMouseEventParams = {
        eventProps: {foo: 'bar'},
        eventType: 'TEST',
      };
      it('should curry a log function', () => {
        const mockMouseEvents = mouseEvents(mockLogger)(
          ...Object.values(mockMouseEventParams),
        );
        mockMouseEvents.onClick();
        expect(mockLogger).toHaveBeenCalled();
      });

      it('should fail silentily when called without a log function', () => {
        const mockMouseEvents = mouseEvents();

        expect(mockMouseEvents).not.toThrowError(TypeError);
        expect(mockMouseEvents()).toBe(false);
      });

      it(`should return a standard ${
        EVENT_CONSTANTS.MOUSE.CLICK
      } eventType when no eventType is given`, () => {
        const MockMouseEvents = mouseEvents(mockLogger)(
          mockMouseEventParams.eventProps,
        );
        MockMouseEvents.onClick();
        expect(mockLogger).toHaveBeenCalled();

        expect(mockLogger).toHaveBeenCalledWith(EVENT_CONSTANTS.MOUSE.CLICK, {
          ...mockMouseEventParams.eventProps,
        });
      });

      it('should return an event with "__CLICK" appended to the eventType', () => {
        const MockMouseEvents = mouseEvents(mockLogger)(
          ...Object.values(mockMouseEventParams),
        );
        MockMouseEvents.onClick();
        expect(mockLogger).toHaveBeenCalled();
        expect(mockLogger).toHaveBeenCalledWith(
          `${mockMouseEventParams.eventType}__CLICK`,
          {
            ...mockMouseEventParams.eventProps,
          },
        );
      });

      it('should return eventProps with "stopPropagation" removed', () => {
        const mockPropagation = jest.fn();
        const mockEvent = {
          stopPropagation: mockPropagation,
        };

        const MockMouseEvents = mouseEvents(mockLogger)(
          ...Object.values({
            ...mockMouseEventParams,
            eventProps: {
              ...mockMouseEventParams.eventProps,
              stopPropagation: true,
            },
          }),
        );

        MockMouseEvents.onClick(mockEvent);
        //check that it calls the stopPropagation function
        expect(mockPropagation).toHaveBeenCalled();
        expect(mockLogger).toHaveBeenCalled();
        expect(mockLogger).toHaveBeenCalledWith(
          `${mockMouseEventParams.eventType}__CLICK`,
          {
            ...mockMouseEventParams.eventProps,
          },
        );
      });
    }); //onClick

    describe('onMouseOver', () => {
      const mockMouseEventParams = {
        eventProps: {foo: 'bar'},
        eventType: 'TEST',
      };
      it('should curry a log function', () => {
        const mockMouseEvents = mouseEvents(mockLogger)(
          ...Object.values(mockMouseEventParams),
        );
        mockMouseEvents.onMouseOver();
        expect(mockLogger).toHaveBeenCalled();
      });

      it('should fail silentily when called without a log function', () => {
        const mockMouseEvents = mouseEvents();

        expect(mockMouseEvents).not.toThrowError(TypeError);
        expect(mockMouseEvents()).toBe(false);
      });

      it(`should return a standard ${
        EVENT_CONSTANTS.MOUSE.HOVER
      } eventType when no eventType is given`, () => {
        const MockMouseEvents = mouseEvents(mockLogger)(
          mockMouseEventParams.eventProps,
        );
        MockMouseEvents.onMouseOver();
        expect(mockLogger).toHaveBeenCalled();

        expect(mockLogger).toHaveBeenCalledWith(EVENT_CONSTANTS.MOUSE.HOVER, {
          ...mockMouseEventParams.eventProps,
        });
      });

      it('should return an event with "__HOVER" appended to the eventType', () => {
        const MockMouseEvents = mouseEvents(mockLogger)(
          ...Object.values(mockMouseEventParams),
        );
        MockMouseEvents.onMouseOver();
        expect(mockLogger).toHaveBeenCalled();
        expect(mockLogger).toHaveBeenCalledWith(
          `${mockMouseEventParams.eventType}__HOVER`,
          {
            ...mockMouseEventParams.eventProps,
          },
        );
      });

      it('should return eventProps with "stopPropagation" removed', () => {
        const mockPropagation = jest.fn();
        const mockEvent = {
          stopPropagation: mockPropagation,
        };

        const MockMouseEvents = mouseEvents(mockLogger)(
          ...Object.values({
            ...mockMouseEventParams,
            eventProps: {
              ...mockMouseEventParams.eventProps,
              stopPropagation: true,
            },
          }),
        );

        MockMouseEvents.onMouseOver(mockEvent);
        //check that it calls the stopPropagation function
        expect(mockPropagation).toHaveBeenCalled();
        expect(mockLogger).toHaveBeenCalled();
        expect(mockLogger).toHaveBeenCalledWith(
          `${mockMouseEventParams.eventType}__HOVER`,
          {
            ...mockMouseEventParams.eventProps,
          },
        );
      });
    }); //onClick
  }); //mouseEvents
}); // end eventUtils
