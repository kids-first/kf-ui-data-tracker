import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from 'react-apollo/test-utils';
import {render} from 'react-testing-library';
import VersionList from '../VersionList';
import fileByKfId from './fileByKfId';

it('renders with more than one versions', () => {
  const fileNodeMultipleVersion = fileByKfId[0].data.fileByKfId;

  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <VersionList
          fileNode={fileNodeMultipleVersion}
          studyId={'SD_00000000'}
        />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const lis = tree.container.querySelectorAll('.FileVersionList--Element');
  expect(lis.length).toBe(4);
});

it('renders with only one version', () => {
  const fileNodeOneVersion = fileByKfId[1].data.fileByKfId;

  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <VersionList fileNode={fileNodeOneVersion} studyId={'SD_00000000'} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();

  const lis = tree.container.querySelectorAll('.FileVersionList--Element');
  expect(lis.length).toBe(1);
});
