import React from 'react';
import {render} from 'react-testing-library';
import StudyHeader from '../StudyHeader';
import {AnalyticsMockProvider} from '../../../analyticsTracking';

it('renders study header with study name and short name', () => {
  const tree = render(
    <AnalyticsMockProvider>
      <StudyHeader
        kfId="SD_00000000"
        shortName="Test Study"
        name="A study used for testing the header"
        modifiedAt={'2019-01-01'}
      />
    </AnalyticsMockProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders study header in loading stage', () => {
  const tree = render(
    <AnalyticsMockProvider>
      <StudyHeader loading />
    </AnalyticsMockProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders study header with no data', () => {
  const tree = render(
    <AnalyticsMockProvider>
      <StudyHeader />
    </AnalyticsMockProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});
