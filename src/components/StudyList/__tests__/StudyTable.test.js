import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, cleanup} from 'react-testing-library';
import allStudies from '../../../../__mocks__/kf-api-study-creator/responses/allStudies.json';
import StudyTable from '../StudyTable';

afterEach(cleanup);

it('renders correctly', () => {
  const studies = allStudies.data.allStudies.edges;

  const tree = render(
    <MemoryRouter>
      <StudyTable studyList={studies} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const rows = tree.container.querySelectorAll('table tbody tr');
  expect(rows.length).toBe(4);
});

it('renders without excluded columns passed to props', () => {
  const studies = allStudies.data.allStudies.edges;
  const excludedColumn = 'name';

  const tree = render(
    <MemoryRouter>
      <StudyTable studyList={studies} exclude={[excludedColumn]} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const cols = tree.container.querySelectorAll('table thead th');
  // Should contain 4 cards in loading state
  expect(cols.length).toBe(16);
  expect(tree.queryByText(excludedColumn)).toBeNull();
});
