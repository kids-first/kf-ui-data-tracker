import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from '@apollo/react-testing';
import {render, cleanup} from '@testing-library/react';
import allStudies from '../../../../__mocks__/kf-api-study-creator/responses/allStudies.json';
import StudyTable from '../StudyTable';

afterEach(cleanup);

it('renders study table correctly', () => {
  const studies = allStudies.data.allStudies.edges;
  // Should contain 4 cards in loading state
  const tree = render(
    <MockedProvider>
      <MemoryRouter>
        <StudyTable studyList={studies} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  const rows = tree.container.querySelectorAll('table tbody tr');
  expect(rows.length).toBe(4);
});

it('renders study table loading state', () => {
  const tree = render(
    <MemoryRouter>
      <StudyTable loading={true} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const rows = tree.container.querySelectorAll('table tbody tr');
  expect(rows.length).toBe(0);
});
