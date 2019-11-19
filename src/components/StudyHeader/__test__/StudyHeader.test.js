import React from 'react';
import {render} from 'react-testing-library';
import StudyHeader from '../StudyHeader';
import {AnalyticsProviderMock} from '../../../analyticsTracking';

it('renders study header with study name and short name', () => {
  const tree = render(
    <AnalyticsProviderMock>
      <StudyHeader
        kfId="SD_00000000"
        shortName="Test Study"
        name="A study used for testing the header"
        modifiedAt={'2019-01-01'}
      />
    </AnalyticsProviderMock>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders study header in loading stage', () => {
  const tree = render(
    <AnalyticsProviderMock>
      <StudyHeader loading />
    </AnalyticsProviderMock>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders study header with no data', () => {
  const tree = render(
    <AnalyticsProviderMock>
      <StudyHeader />
    </AnalyticsProviderMock>,
  );
  expect(tree.container).toMatchSnapshot();
});
