import React from 'react';
import wait from 'waait';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from '@apollo/react-testing';
import {render, cleanup, act, fireEvent} from '@testing-library/react';
import ListFilterBar from '../ListFilterBar';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import StudyFilesListView from '../../../views/StudyFilesListView';

afterEach(cleanup);

it('renders ListFilterBar with no files', async () => {
  const filters = {
    sortMethod: '',
    sortDirection: 'ascending',
    typeFilterStatus: '',
    tagFilterStatus: '',
    searchString: '',
  };
  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <ListFilterBar filters={filters} setFilters={jest.fn()} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
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
  act(() => {
    fireEvent.click(tree.getByText(/Date option/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Modified date/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByTestId('sort-direction-button'));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByTestId('sort-direction-button'));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByText(/Document type/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getAllByText(/Biospecimen Manifest/i)[1]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getAllByText(/Tag/i)[0]);
  });
  act(() => {
    fireEvent.click(tree.getAllByText(/dbGaP/i)[0]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByTestId('file-item').length).toBe(1);
  act(() => {
    fireEvent.change(tree.getByLabelText('file-search-input'), {
      target: {value: 'its.mp3'},
    });
  });
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByTestId('file-item').length).toBe(1);
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
  act(() => {
    fireEvent.click(tree.getByText(/Date option/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Modified date/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByTestId('sort-direction-button'));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByTestId('sort-direction-button'));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByText(/Document type/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getAllByText(/Biospecimen Manifest/i)[1]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getAllByText(/Tag/i)[0]);
  });
  act(() => {
    fireEvent.click(tree.getAllByText(/dbGaP/i)[0]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByTestId('file-item').length).toBe(1);
  act(() => {
    fireEvent.change(tree.getByLabelText('file-search-input'), {
      target: {value: 'its.mp3'},
    });
  });
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByTestId('file-item').length).toBe(1);
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
  // Sort files by create date by clicking on the file sorting dropdown
  act(() => {
    fireEvent.click(tree.getByTestId('show-sort-button'));
  });
  act(() => {
    fireEvent.click(tree.getByText(/Date option/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Modified date/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByTestId('sort-direction-button'));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByTestId('sort-direction-button'));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByTestId('show-filter-button'));
  });
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByText(/Document type/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getAllByText(/Biospecimen Manifest/i)[1]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getAllByText(/Tag/i)[0]);
  });
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getAllByText(/dbGaP/i)[0]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByTestId('file-item').length).toBe(1);
  act(() => {
    fireEvent.change(tree.getByLabelText('file-search-input'), {
      target: {value: 'its.mp3'},
    });
  });
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByTestId('file-item').length).toBe(1);
});
