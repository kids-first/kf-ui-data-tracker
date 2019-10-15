import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from 'react-apollo/test-utils';
import {render} from 'react-testing-library';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import fileByKfId from '../../../../../__mocks__/kf-api-study-creator/responses/fileByKfId';
import VersionList from '../VersionList';

it('renders with more than one versions', () => {
  const fileNodeMultipleVersion = fileByKfId.data.fileByKfId;

  const tree = render(
    <MemoryRouter>
      <MockedProvider mocks={mocks}>
        <VersionList
          fileNode={fileNodeMultipleVersion}
          studyId={'SD_00000000'}
        />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
  const lis = tree.getAllByTestId('version-item');
  expect(lis.length).toBe(3);
});

it('renders with no versions', () => {
  var fileNodeNoVersion = fileByKfId.data.fileByKfId;
  fileNodeNoVersion.versions.edges = [];

  const tree = render(
    <MemoryRouter>
      <MockedProvider mocks={mocks}>
        <VersionList fileNode={fileNodeNoVersion} studyId={'SD_00000000'} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
  const lis = tree.getAllByTestId('version-item');
  expect(lis.length).toBe(3);
});
