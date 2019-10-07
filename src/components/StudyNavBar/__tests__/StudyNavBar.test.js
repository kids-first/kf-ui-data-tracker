import React from 'react';
import {render} from 'react-testing-library';
import {MemoryRouter} from 'react-router-dom';
import StudyNavBar from '../StudyNavBar';

it('renders StudyNavBar correctly -- default look', () => {
  const tree = render(
    <MemoryRouter>
      <StudyNavBar />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders StudyNavBar correctly -- BETA user look', () => {
  const tree = render(
    <MemoryRouter>
      <StudyNavBar isBeta={true} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});
