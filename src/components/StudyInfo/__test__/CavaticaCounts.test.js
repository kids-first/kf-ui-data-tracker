import React from 'react';
import {render, cleanup} from 'react-testing-library';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from 'react-apollo/test-utils';
import CavaticaCounts from '../CavaticaCounts';
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';

afterEach(cleanup);

it('renders CavaticaCounts in default stage', () => {
  const projects = studyByKfId.data.studyByKfId.projects.edges;
  const studyId = studyByKfId.data.studyByKfId.kfId;
  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <CavaticaCounts projects={projects} title={studyId} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders CavaticaCounts with empty project list', () => {
  const studyId = studyByKfId.data.studyByKfId.kfId;
  const tree = render(
    <MemoryRouter>
      <MockedProvider>
        <CavaticaCounts projects={[]} title={studyId} />
      </MockedProvider>
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});