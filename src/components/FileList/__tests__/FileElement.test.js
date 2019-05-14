import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, cleanup} from 'react-testing-library';
import FileElement from '../FileElement';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';
import {MockedProvider} from 'react-apollo/test-utils';

afterEach(cleanup);
it('renders correctly', () => {
  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <FileElement
          fileListId={studyByKfId.data.studyByKfId.kfId}
          fileNode={file}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders loading state', () => {
  const file = studyByKfId.data.studyByKfId.files.edges[0].node;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <FileElement
          loading={true}
          fileNode={file}
          fileListId={studyByKfId.data.studyByKfId.kfId}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});
