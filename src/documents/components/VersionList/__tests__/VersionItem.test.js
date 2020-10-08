import React from 'react';
import {Table} from 'semantic-ui-react';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from '@apollo/react-testing';
import {render, cleanup, fireEvent, act} from '@testing-library/react';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import fileByKfId from '../../../../../__mocks__/kf-api-study-creator/responses/fileByKfId';
import VersionItem from '../VersionItem';

afterEach(cleanup);
it('renders correctly', async () => {
  const fileNode = fileByKfId.data.fileByKfId;
  const versionNode = fileNode.versions.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <Table compact="very" selectable>
          <Table.Body>
            <VersionItem
              key={0}
              studyId={'SD_00000000'}
              fileId={fileNode.kfId}
              fileType={fileNode.fileType}
              versionNode={versionNode}
              index={0}
              onNameClick={jest.fn()}
            />
          </Table.Body>
        </Table>
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  // Click on version name
  act(() => {
    fireEvent.click(tree.getByText(/VersionFileName.js/));
  });
});

it('renders correctly with 1 as index -- status dot', () => {
  const fileNode = fileByKfId.data.fileByKfId;
  const versionNode = fileNode.versions.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <Table compact="very" selectable>
          <Table.Body>
            <VersionItem
              key={1}
              studyId={'SD_00000000'}
              fileId={fileNode.kfId}
              fileType={fileNode.fileType}
              versionNode={versionNode}
              index={1}
            />
          </Table.Body>
        </Table>
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders correctly with not enough data', () => {
  const fileNode = fileByKfId.data.fileByKfId;
  var versionNode = fileNode.versions.edges[0].node;
  versionNode.size = null;
  versionNode.description = '';
  versionNode.state = null;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <Table compact="very" selectable>
          <Table.Body>
            <VersionItem
              key={0}
              studyId={'SD_00000000'}
              fileId={fileNode.kfId}
              fileType={fileNode.fileType}
              versionNode={versionNode}
              index={0}
            />
            <VersionItem
              key={1}
              studyId={'SD_00000000'}
              fileId={fileNode.kfId}
              fileType={fileNode.fileType}
              versionNode={versionNode}
              index={1}
            />
          </Table.Body>
        </Table>
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});
