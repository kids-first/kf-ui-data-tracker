import React from 'react';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {render, act, fireEvent, cleanup} from 'react-testing-library';
import StudyFilesListView from '../StudyFilesListView';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import {AnalyticsProviderMock} from '../../../analyticsTracking';

afterEach(cleanup);

it('renders correctly', async () => {
  const tree = render(
    <AnalyticsProviderMock>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
          <StudyFilesListView
            history={[]}
            match={{params: {kfId: 'SD_8WX8QQ06'}}}
          />
        </MemoryRouter>
      </MockedProvider>
    </AnalyticsProviderMock>,
  );
  await wait(0);

  const rows = tree.getAllByTestId('file-item');

  expect(rows.length).toBe(2);

  expect(tree.container).toMatchSnapshot();
});

it('deletes a file correctly', async () => {
  const tree = render(
    <AnalyticsProviderMock>
      <MockedProvider mocks={mocks}>
        <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
          <StudyFilesListView
            history={[]}
            match={{params: {kfId: 'SD_8WX8QQ06'}}}
          />
        </MemoryRouter>
      </MockedProvider>
    </AnalyticsProviderMock>,
  );
  await wait(0);
  expect(tree.container).toMatchSnapshot();

  const rows = tree.getAllByTestId('file-item');
  expect(rows.length).toBe(2);

  // Delete the second file
  act(() => {
    fireEvent.click(tree.getAllByTestId('delete-button')[1]);
  });
  act(() => {
    fireEvent.click(tree.getByTestId('delete-confirm'));
  });
  await wait();

  // Should only be one file now

  const newRows = tree.getAllByTestId('file-item');
  expect(newRows.length).toBe(1);
  expect(tree.container).toMatchSnapshot();
});

it('shows an error', async () => {
  const tree = render(
    <AnalyticsProviderMock>
      <MockedProvider mocks={[mocks[2], mocks[8]]}>
        <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
          <StudyFilesListView
            history={[]}
            match={{params: {kfId: 'SD_8WX8QQ06'}}}
          />
        </MemoryRouter>
      </MockedProvider>
    </AnalyticsProviderMock>,
  );
  await wait(0);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText('Error')).not.toBeNull();
});

it('renders ListFilterBar with files -- screen width 1200', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
        <StudyFilesListView match={{params: {kfId: 'SD_8WX8QQ06'}}} />
      </MemoryRouter>
    </MockedProvider>,
  );
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1200,
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
});

it('renders ListFilterBar with files -- screen width 800', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
        <StudyFilesListView match={{params: {kfId: 'SD_8WX8QQ06'}}} />
      </MemoryRouter>
    </MockedProvider>,
  );
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 800,
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
});

it('renders ListFilterBar with files -- screen width 600', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
        <StudyFilesListView match={{params: {kfId: 'SD_8WX8QQ06'}}} />
      </MemoryRouter>
    </MockedProvider>,
  );
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 600,
  });

  await wait();
  expect(tree.container).toMatchSnapshot();

  // fireEvent.click(tree.getAllByTestId('show-filter-button'));
  //
  // fireEvent.click(tree.getAllByTestId('show-sort-button'));
  //
  // await wait();
  // expect(tree.container).toMatchSnapshot();
});
