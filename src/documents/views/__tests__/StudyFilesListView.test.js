import React from 'react';
import wait from 'waait';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {render, act, fireEvent, cleanup} from '@testing-library/react';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../../Routes';
import StudyFilesListView from '../StudyFilesListView';

jest.mock('auth0-js');
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

it('renders with files pagination', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_X6E5KWM4/documents']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  // Sort files by create date by clicking on the file sorting dropdown
  const sortDropdown = tree.getByText(/Date option/i);
  fireEvent.click(sortDropdown);
  await wait();
  const sortByCreateDate = tree.getByText(/Modified date/i);
  fireEvent.click(sortByCreateDate);
  await wait(10);
  expect(tree.container).toMatchSnapshot();

  // 12 files in total, page 1 contains 10
  const lisPage1 = tree.queryAllByTestId('file-item');
  expect(lisPage1.length).toBe(10);

  // Click on the next button to go to next page
  let button1 = tree.getByLabelText('Next page');
  button1.click();
  await wait();
  expect(tree.container).toMatchSnapshot();

  // 12 files in total, 10 files per page, page 2 should have 2 files
  const lisPage2 = tree.queryAllByTestId('file-item');
  expect(lisPage2.length).toBe(2);

  // Click on the previous button to go to previous page
  let button2 = tree.getByLabelText('Previous page');
  button2.click();
  await wait();

  // Filter files by file type by clicking on the document type dropdown
  const filterDropdown = tree.getByText(/Document type/i);
  fireEvent.click(filterDropdown);
  await wait();
  const filterByFileType = tree.queryAllByText(/Biospecimen Manifest/i)[1];
  fireEvent.click(filterByFileType);
  await wait();

  expect(tree.container).toMatchSnapshot();
  const lisPage3 = tree.queryAllByTestId('file-item');
  expect(lisPage3.length).toBe(6);
});

it('renders with files with tag filter', async () => {
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
  await wait();
  expect(tree.container).toMatchSnapshot();

  // Sort files by create date by clicking on the file sorting dropdown
  act(() => {
    fireEvent.click(tree.getByText(/Date option/i));
  });
  act(() => {
    fireEvent.click(tree.getByText(/Modified date/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  const lisPage1 = tree.queryAllByTestId('file-item');
  expect(lisPage1.length).toBe(2);

  act(() => {
    fireEvent.click(tree.getAllByText(/Tag/i)[0]);
  });
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getAllByText(/dbGaP/i)[0]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  const filteredPage = tree.queryAllByTestId('file-item');
  expect(filteredPage.length).toBe(1);
});

it('renders with files with more tag toggle', async () => {
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
  await wait();
  expect(tree.container).toMatchSnapshot();

  // Sort files by create date by clicking on the file sorting dropdown
  act(() => {
    fireEvent.click(tree.getByText(/Modified date/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByText('hidden tag').length).toBe(1);
  act(() => {
    fireEvent.click(tree.getByText(/1 more/i));
  });
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByText('hidden tag').length).toBe(2);
  act(() => {
    fireEvent.click(tree.getByText(/show less/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryAllByText('hidden tag').length).toBe(1);
});

it('deletes a file correctly', async () => {
  const tree = render(
    <MockedProvider mocks={[mocks[1], mocks[3], mocks[8], mocks[26]]}>
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
  act(() => {
    fireEvent.click(tree.getAllByTestId('delete-button')[1]);
  });
  act(() => {
    fireEvent.click(tree.getByTestId('delete-confirm'));
  });
  await wait(200);

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

it('update tags with no error adding tag and error with removing tag', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[61], mocks[26], mocks[62], mocks[26]]}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/documents']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
    {
      container: document.body,
    },
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
  expect(tree.container).toMatchSnapshot();

  // Add tag "Email" to file SF_5ZPEM167
  act(() => {
    fireEvent.click(tree.getAllByTestId('tag-file')[0]);
  });
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getAllByText(/Tags/i)[1]);
  });
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByText(/Email/i));
  });
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByTestId('tag-file-add'));
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();

  // Click on the tag itself will not go into file detial view
  act(() => {
    fireEvent.click(tree.getByText(/Email/i));
  });
  expect(tree.container).toMatchSnapshot();

  // filter by tag "Email" has one return
  act(() => {
    fireEvent.click(tree.getByTestId('show-filter-button'));
  });
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getAllByText(/Tag/i)[0]);
  });
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getAllByText(/Email/i)[0]);
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  const filteredPage = tree.queryAllByTestId('file-item');
  expect(filteredPage.length).toBe(1);

  // Add an invalid tag (already exist and too long)
  act(() => {
    fireEvent.click(tree.getByTestId('tag-file'));
  });
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.change(tree.container.querySelectorAll('input')[4], {
      target: {value: 'email'},
    });
  });
  act(() => {
    fireEvent.click(tree.getByText(/Add/i));
  });
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Tag already exist/)).not.toBeNull();

  act(() => {
    fireEvent.change(tree.container.querySelectorAll('input')[4], {
      target: {
        value: 'Lorem ipsum dolor sit amet mei ex posse verear invenire',
      },
    });
  });
  act(() => {
    fireEvent.click(tree.getByText(/Add/i));
  });
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Tag is too long/i)).not.toBeNull();

  // Remove "Email" tag with mocked error
  act(() => {
    fireEvent.click(tree.getByTestId('remove-tag'));
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Failed to update the file tags/)).not.toBeNull();
});

it('download and delete multiple documents using checkbox selection', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[1], mocks[3], mocks[8], mocks[26], mocks[67], mocks[68]]}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
        <StudyFilesListView
          history={[]}
          match={{params: {kfId: 'SD_8WX8QQ06'}}}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();

  // Download/Delete selected button are hidden when no file is selected
  expect(tree.queryByText(/Delete Selected Document/)).toBeNull();

  act(() => {
    fireEvent.click(tree.getAllByTestId('file-select')[0]);
  });
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Delete Selected Document/)).not.toBeNull();

  act(() => {
    fireEvent.click(tree.getAllByTestId('file-select')[1]);
  });
  act(() => {
    fireEvent.click(tree.getByTestId('file-select-all'));
  });
  act(() => {
    fireEvent.click(tree.getByTestId('file-select-all'));
  });
  expect(tree.container).toMatchSnapshot();

  // Download selected files
  act(() => {
    fireEvent.click(tree.queryByText(/Download Selected Document/));
  });
  await wait();

  act(() => {
    fireEvent.click(tree.getAllByTestId('file-select')[0]);
  });

  // Delete the second file
  act(() => {
    fireEvent.click(tree.queryByText(/Delete Selected Document/));
  });
  act(() => {
    fireEvent.click(tree.getByTestId('delete-confirm'));
  });
  await wait(100);

  // Should only be one file now
  const newRows = tree.getAllByTestId('file-item');
  expect(tree.container).toMatchSnapshot();
  expect(newRows.length).toBe(1);
});
