import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render} from 'react-testing-library';
import allStudies from './allStudies.json';
import StudyList from '../StudyList';

it('renders correctly', () => {
  const studies = allStudies.data.allStudies.edges;

  const tree = render(
    <MemoryRouter>
      <StudyList studyList={studies} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const cards = tree.container.querySelectorAll('.StudyList li');
  expect(cards.length).toBe(3);
});

it('renders loading state', () => {
  const tree = render(
    <MemoryRouter>
      <StudyList loading={true} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const cards = tree.container.querySelectorAll('.StudyList li');
  // Should contain 4 cards in loading state
  expect(cards.length).toBe(4);
});
