import React from 'react';
import {render, cleanup} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from '@apollo/react-testing';
import FileCounts from '../FileCounts';
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';

afterEach(cleanup);

it('renders FileCounts in default stage', () => {
  const files = studyByKfId.data.studyByKfId.files.edges;
  const studyId = studyByKfId.data.studyByKfId.kfId;
  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <FileCounts files={files} title={studyId} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders FileFileCounts with empty file list', () => {
  const studyId = studyByKfId.data.studyByKfId.kfId;
  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <FileCounts files={[]} title={studyId} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});
