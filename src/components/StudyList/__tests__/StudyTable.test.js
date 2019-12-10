import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, cleanup} from 'react-testing-library';
import allStudies from '../../../../__mocks__/kf-api-study-creator/responses/allStudies.json';
import StudyTable from '../StudyTable';
import {AnalyticsProviderMock} from '../../../analyticsTracking';

afterEach(cleanup);

it('renders study table correctly', () => {
  const studies = allStudies.data.allStudies.edges;
  const excludedColumns = ['name', 'createdAt', 'modifiedAt'];
  // Should contain 4 cards in loading state
  const tree = render(
    <AnalyticsProviderMock>
      <MemoryRouter>
        <StudyTable studyList={studies} exclude={excludedColumns} />
      </MemoryRouter>
    </AnalyticsProviderMock>,
  );
  expect(tree.container).toMatchSnapshot();

  const rows = tree.container.querySelectorAll('table tbody tr');
  expect(rows.length).toBe(4);
});

it('renders study table without excluded columns passed to props', () => {
  const studies = allStudies.data.allStudies.edges;
  const excludedColumn = 'name';

  const tree = render(
    <AnalyticsProviderMock>
      <MemoryRouter>
        <StudyTable studyList={studies} exclude={[excludedColumn]} />
      </MemoryRouter>
    </AnalyticsProviderMock>,
  );
  expect(tree.container).toMatchSnapshot();

  const cols = tree.container.querySelectorAll('table thead th');
  expect(cols.length).toBe(16);
  expect(tree.queryByText(excludedColumn)).toBeNull();
});

it('renders study table for ADMIN role', () => {
  const studies = allStudies.data.allStudies.edges;
  const excludedColumns = ['name', 'createdAt', 'modifiedAt'];

  const tree = render(
    <AnalyticsProviderMock>
      <MemoryRouter>
        <StudyTable
          studyList={studies}
          isAdmin={true}
          exclude={excludedColumns}
        />
      </MemoryRouter>
    </AnalyticsProviderMock>,
  );
  expect(tree.container).toMatchSnapshot();

  const rows = tree.container.querySelectorAll('table tbody tr');
  expect(rows.length).toBe(4);
});

it('renders study table loading state', () => {
  const tree = render(
    <AnalyticsProviderMock>
      <MemoryRouter>
        <StudyTable loading={true} />
      </MemoryRouter>
    </AnalyticsProviderMock>,
  );
  expect(tree.container).toMatchSnapshot();

  const rows = tree.container.querySelectorAll('table tbody tr');
  expect(rows.length).toBe(0);
});
