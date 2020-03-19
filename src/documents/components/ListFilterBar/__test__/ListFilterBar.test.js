import React from 'react';
import wait from 'waait';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from '@apollo/react-testing';
import {render, cleanup, act, fireEvent} from '@testing-library/react';
import ListFilterBar from '../ListFilterBar';
import studyByKfId from '../../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import StudyFilesListView from '../../../views/StudyFilesListView';

afterEach(cleanup);

it('renders ListFilterBar with files', async () => {
  const files = studyByKfId.data.studyByKfId.files.edges;
  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <ListFilterBar
          selection={[]}
          fileList={files}
          filteredList={jest.fn()}
        />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  // Click on Approval status dropwdown
  act(() => {
    fireEvent.click(tree.getByText(/Tag/));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  // Click on Document type dropwdown
  act(() => {
    fireEvent.click(tree.getByText(/Document type/));
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
        <ListFilterBar selection={[]} filteredList={jest.fn()} />
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
    fireEvent.click(tree.getAllByText(/dbGaP/i)[1]);
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
    fireEvent.click(tree.getAllByText(/dbGaP/i)[1]);
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
    fireEvent.click(tree.getAllByText(/dbGaP/i)[1]);
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
