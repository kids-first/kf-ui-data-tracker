import React from 'react';
import wait from 'waait';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from 'react-apollo/test-utils';
import {render} from 'react-testing-library';
import FileList from '../FileList';
import studyByKfId from './studyByKfId';

it('renders with files', async () => {
  const files = studyByKfId.data.studyByKfId.files.edges;

  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <FileList fileList={files} studyId={'SD_00000000'} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  // 8 files in total, page 1 contains 5
  const lisPage1 = tree.container.querySelectorAll('.FileList--Element');
  expect(lisPage1.length).toBe(5);

  // Click on the next button to go to next page
  let button = tree.getByText(/>/);
  button.click();

  await wait();

  // 8 files in total, 5 files per page, page 2 should have 3 files
  const lisPage2 = tree.container.querySelectorAll('.FileList--Element');
  expect(lisPage2.length).toBe(3);
});

it('renders without files', () => {
  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <FileList fileList={[]} studyId={'SD_00000000'} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const lis = tree.container.querySelectorAll('.FileList--Element');
  expect(lis.length).toBe(0);

  // Hide pagination when no files exist
  const pagination = tree.container.querySelectorAll('.Pagination');
  expect(pagination.length).toBe(0);
});
