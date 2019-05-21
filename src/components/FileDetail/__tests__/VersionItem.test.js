import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from 'react-apollo/test-utils';
import {render, cleanup} from 'react-testing-library';
import VersionItem from '../VersionItem';
import fileByKfId from './fileByKfId';

afterEach(cleanup);
it('renders correctly with 0 as index -- show latest', () => {
  const fileNode = fileByKfId[0].data.fileByKfId;
  const versionNode = fileNode.versions.edges[0].node;
  const tree = render(
    <MockedProvider>
      <MemoryRouter>
        <VersionItem
          key={0}
          studyId={'SD_00000000'}
          fileId={fileNode.kfId}
          fileType={fileNode.fileType}
          fileName={fileNode.name}
          versionNode={versionNode}
          index={0}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
  const button = tree.getByText(/Latest/);
  expect(button.innerHTML).toBe('Latest');
});

it('renders correctly with 1 as index -- show version kfId', () => {
  const fileNode = fileByKfId[0].data.fileByKfId;
  const versionNode = fileNode.versions.edges[0].node;
  const tree = render(
    <MockedProvider>
      <MemoryRouter>
        <VersionItem
          key={1}
          studyId={'SD_00000000'}
          fileId={fileNode.kfId}
          fileType={fileNode.fileType}
          fileName={fileNode.name}
          versionNode={versionNode}
          index={1}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
  const button = tree.getByText(/FV_BC7BWZ2W/);
  expect(button.innerHTML).toBe('FV_BC7BWZ2W');
});
