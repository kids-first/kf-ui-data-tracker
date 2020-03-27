import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, cleanup} from '@testing-library/react';
import FileList from '../FileList';

afterEach(cleanup);

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
