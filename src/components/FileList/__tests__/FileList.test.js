import React from 'react';
import wait from 'waait';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from 'react-apollo/test-utils';
import {render, cleanup, fireEvent} from 'react-testing-library';
import FileList from '../FileList';
import studyByKfId from './studyByKfId';

afterEach(cleanup);

it('renders with files', async () => {
  const files = studyByKfId.data.studyByKfId.files.edges;

  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <FileList fileList={files} studyId={'SD_00000000'} />
      </MockedProvider>
    </MemoryRouter>,
  );

  // Sort files by create date by clicking on the file sorting dropdown
  const sortDropdown = tree.getByText(/Date option/i);
  fireEvent.click(sortDropdown);
  await wait();
  const sortByCreateDate = tree.getByText(/Modified date/i);
  fireEvent.click(sortByCreateDate);
  await wait();

  expect(tree.container).toMatchSnapshot();

  // 12 files in total, page 1 contains 10
  const lisPage1 = tree.queryAllByTestId('file-item');
  expect(lisPage1.length).toBe(10);

  // Click on the next button to go to next page

  let button = tree.getByLabelText('Next page');
  button.click();

  await wait();

  // 12 files in total, 10 files per page, page 2 should have 2 files
  const lisPage2 =  tree.queryAllByTestId('file-item');
  expect(lisPage2.length).toBe(2);
});

it('renders without files', () => {
  const tree = render(
    <MemoryRouter>
      <FileList fileList={[]} studyId={'SD_00000000'} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const lis = tree.queryAllByTestId('file-item');
  expect(lis.length).toBe(0);

  // Hide pagination when no files exist
  const pagination = tree.container.querySelectorAll('.Pagination');
  expect(pagination.length).toBe(0);
});
