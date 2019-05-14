import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from 'react-apollo/test-utils';
import {render} from 'react-testing-library';
import FileList from '../FileList';
import studyByKfId from './studyByKfId';

it('renders with files', () => {
  const files = studyByKfId.data.studyByKfId.files.edges;

  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <FileList fileList={files} studyId={'SD_00000000'} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const lis = tree.container.querySelectorAll('.FileList--Element');
  expect(lis.length).toBe(4);
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
});
