import React from 'react';
import {render} from 'react-testing-library';
import {MemoryRouter, Route} from 'react-router-dom';
import StudyNavBar from '../StudyNavBar';

it('renders StudyNavBar correctly -- default look', () => {
  const tree = render(
    <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/documents']}>
      <Route exact path="/study/:kfId/documents" component={StudyNavBar} />
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
