import React from 'react';
import wait from 'waait';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from 'react-apollo/test-utils';
import {render, cleanup, act, fireEvent} from 'react-testing-library';
import ListFilterBar from '../ListFilterBar';
import studyByKfId from '../../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';

afterEach(cleanup);

it('renders ListFilterBar with files', async () => {
  const files = studyByKfId.data.studyByKfId.files.edges;
  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <ListFilterBar fileList={files} filteredList={jest.fn()} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  // Click on Approval status dropwdown
  act(() => {
    fireEvent.click(tree.getByText(/Approval status/));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  // Click on File type dropwdown
  act(() => {
    fireEvent.click(tree.getByText(/File type/));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  // Click on Date option dropwdown
  act(() => {
    fireEvent.click(tree.getByText(/Date option/));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  // Click on sort direction button
  act(() => {
    fireEvent.click(tree.getAllByTestId('sort-direction-button')[0]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
});

it('renders ListFilterBar with no files', async () => {
  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <ListFilterBar filteredList={jest.fn()} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});
