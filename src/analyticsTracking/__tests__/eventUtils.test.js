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
  describe('popupTracking', () => {
    const mockPopupEventParams = {
      eventProps: {
        name: 'test tooltip',
        content: 'This is testing the toolip!',
        link: 'http://website.net',
      },
      scope: ' testing toolti p',
    };
    const mockLogPopupProps = {
      tooltip_name: mockPopupEventParams.eventProps.name,
      tooltip_content: mockPopupEventParams.eventProps.content,
      link: mockPopupEventParams.eventProps.link,
    };
    describe('onClick', () => {
      it('shouuld curry "log" param to mouseEvents without error', () => {
        // test with no logger
        expect(popupTracking()).not.toThrowError(TypeError);
        // test with logger
        const mockPopup = popupTracking(mockLogger)(
          ...Object.values(mockPopupEventParams),
        );
        mockPopup.onClick();
        expect(mockLogger).toHaveBeenCalled();
      });

      it(`should use a standard "${
        EVENT_CONSTANTS.TOOLTIP.scope
      }_<normalized_name>__CLICK" eventType when no scope param is given`, () => {
        const mockPopupEvent = popupTracking(mockLogger)(
          mockPopupEventParams.eventProps,
        );
        mockPopupEvent.onClick();
        /** @TODO: use json schema to validate this  */
        expect(mockLogger).toHaveBeenCalledWith(
          `${EVENT_CONSTANTS.TOOLTIP.scope}__${normalizeEventType(
            mockPopupEventParams.eventProps.name,
          )}__CLICK`,
          mockLogPopupProps,
        );
      });

      it('should pass down inherited props when instantiated', () => {
        const inheritedProps = {foo: 'bar'};
        const mockPopupEvent = popupTracking(mockLogger, inheritedProps)(
          ...Object.values(mockPopupEventParams),
        );
        mockPopupEvent.onClick();
        /** @TODO: use json schema to validate this  */
        expect(mockLogger).toHaveBeenCalledWith(
          `${normalizeEventType(mockPopupEventParams.scope)}__CLICK`,
          {...mockLogPopupProps, ...inheritedProps},
        );
      });

      it('should call "stopPropagation" on default', () => {
        const mockPropagation = jest.fn();
        const mockEvent = {
          stopPropagation: mockPropagation,
        };

        const mockPopupEvent = popupTracking(mockLogger)(
          ...Object.values(mockPopupEventParams),
        );

        mockPopupEvent.onClick(mockEvent);
        //check that it calls the stopPropagation function
        expect(mockPropagation).toHaveBeenCalled();
        expect(mockLogger).toHaveBeenCalled();
      });
    }); //onClick

    describe('onMouseOver', () => {
      it('shouuld curry "log" param to mouseEvents without error', () => {
        // test with no logger
        expect(popupTracking()).not.toThrowError(TypeError);
        // test with logger
        const mockPopup = popupTracking(mockLogger)(
          ...Object.values(mockPopupEventParams),
        );
        mockPopup.onMouseOver();
        expect(mockLogger).toHaveBeenCalled();
      });

      it(`should use a standard "${
        EVENT_CONSTANTS.TOOLTIP.scope
      }__<normalized_name>__HOVER" eventType when no scope param is given`, () => {
        const mockPopupEvent = popupTracking(mockLogger)(
          mockPopupEventParams.eventProps,
        );
        mockPopupEvent.onMouseOver();
        /** @TODO: use json schema to validate this  */
        expect(mockLogger).toHaveBeenCalledWith(
          `${EVENT_CONSTANTS.TOOLTIP.scope}__${normalizeEventType(
            mockPopupEventParams.eventProps.name,
          )}__HOVER`,
          mockLogPopupProps,
        );
      });

      it('should pass down inherited props when instantiated', () => {
        const inheritedProps = {foo: 'bar'};
        const mockPopupEvent = popupTracking(mockLogger, inheritedProps)(
          ...Object.values(mockPopupEventParams),
        );
        mockPopupEvent.onMouseOver();
        /** @TODO: use json schema to validate this  */
        expect(mockLogger).toHaveBeenCalledWith(
          `${normalizeEventType(mockPopupEventParams.scope)}__HOVER`,
          {...mockLogPopupProps, ...inheritedProps},
        );
      });

      it('should call "stopPropagation" on default', () => {
        const mockPropagation = jest.fn();
        const mockEvent = {
          stopPropagation: mockPropagation,
        };

        const mockPopupEvent = popupTracking(mockLogger)(
          ...Object.values(mockPopupEventParams),
        );

        mockPopupEvent.onMouseOver(mockEvent);
        //check that it calls the stopPropagation function
        expect(mockPropagation).toHaveBeenCalled();
        expect(mockLogger).toHaveBeenCalled();
      });
    }); //onMouseOver
  }); //popupTracking
}); // end eventUtils
