import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, cleanup} from 'react-testing-library';
import allStudies from '../../../../__mocks__/kf-api-study-creator/responses/allStudies.json';
import StudyList from '../StudyList';

afterEach(cleanup);

it('renders correctly', () => {
  const studies = allStudies.data.allStudies.edges;

  const tree = render(
    <MemoryRouter>
      <StudyList studyList={studies} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const cards = tree.container.querySelectorAll('.ui .card');
  expect(cards.length).toBe(4);
});

it('renders loading state', () => {
  const tree = render(
    <MemoryRouter>
      <StudyList loading={true} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const cards = tree.container.querySelectorAll('.ui .card');
  // Should contain 4 cards in loading state
  expect(cards.length).toBe(4);
});
