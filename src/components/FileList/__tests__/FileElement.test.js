import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render} from 'react-testing-library';
import FileElement from '../FileElement';
import studyByKfId from './studyByKfId';

it('renders correctly', () => {
  jest.spyOn(Date, 'now').mockImplementation(() => 1556044228000);
  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const tree = render(
    <MemoryRouter>
      <FileElement fileNode={file} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders loading state', () => {
  jest.spyOn(Date, 'now').mockImplementation(() => 1556044228000);
  const tree = render(
    <MemoryRouter>
      <FileElement loading={true} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders error state', () => {
  jest.spyOn(Date, 'now').mockImplementation(() => 1556044228000);
  const tree = render(
    <MemoryRouter>
      <FileElement
        error={{graphQLErrors: [{message: 'something went wrong'}]}}
      />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText('something went wrong')).not.toBeNull();
});
