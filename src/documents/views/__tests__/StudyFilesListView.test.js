import React from 'react';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {render, fireEvent, cleanup} from 'react-testing-library';
import StudyFilesListView from '../StudyFilesListView';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';

afterEach(cleanup);

it('renders correctly', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
        <StudyFilesListView
          history={[]}
          match={{params: {kfId: 'SD_8WX8QQ06'}}}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(0);

  const rows = tree.getAllByTestId('file-item');

  expect(rows.length).toBe(2);

  expect(tree.container).toMatchSnapshot();
});

it('deletes a file correctly', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
        <StudyFilesListView
          history={[]}
          match={{params: {kfId: 'SD_8WX8QQ06'}}}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(0);
  expect(tree.container).toMatchSnapshot();

  const rows = tree.getAllByTestId('file-item');
  expect(rows.length).toBe(2);

  // Delete the second file
  fireEvent.click(tree.getAllByTestId('delete-button')[1]);
  fireEvent.click(tree.getByTestId('delete-confirm'));
  await wait();

  // Should only be one file now

  const newRows = tree.getAllByTestId('file-item');
  expect(newRows.length).toBe(1);
  expect(tree.container).toMatchSnapshot();
});

it('shows an error', async () => {
  const tree = render(
    <MockedProvider mocks={[mocks[2], mocks[8]]}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
        <StudyFilesListView
          history={[]}
          match={{params: {kfId: 'SD_8WX8QQ06'}}}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(0);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText('Error')).not.toBeNull();
});
