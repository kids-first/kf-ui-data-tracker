import React from 'react';
import {render} from 'react-testing-library';
import {MemoryRouter} from 'react-router-dom';
import StudyNavBar from '../StudyNavBar';

it('renders correctly', () => {
  const tree = render(
    <MemoryRouter>
      <StudyNavBar />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});
