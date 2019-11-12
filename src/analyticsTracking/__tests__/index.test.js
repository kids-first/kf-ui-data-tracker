describe('analyticsTracking', () => {
  const index = require('../');
  it('exports AnalyticsTrackingProvider', () => {
    expect(index.AnalyticsTrackingProvider).toBeDefined();
  });

  it('exports AmplitudeProxy', () => {
    expect(index.AmplitudeProxy).toBeDefined();
  });

  it('exports EVENT_CONSTANTS', () => {
    expect(index.EVENT_CONSTANTS).toBeDefined();
  });
});
