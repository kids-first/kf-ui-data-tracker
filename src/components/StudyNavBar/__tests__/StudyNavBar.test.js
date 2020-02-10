import React from 'react';
import {render} from '@testing-library/react';
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
