import {normalizeEventType} from '../eventUtils';
import {cleanup} from '@testing-library/react';

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
  });
});
