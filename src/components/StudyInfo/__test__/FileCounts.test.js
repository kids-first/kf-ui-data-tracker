import React from 'react';
import {render, cleanup} from 'react-testing-library';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from 'react-apollo/test-utils';
import {AnalyticsProviderMock} from '../../../analyticsTracking';
import FileCounts from '../FileCounts';
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';

afterEach(cleanup);

it('renders FileCounts in default stage', () => {
  const files = studyByKfId.data.studyByKfId.files.edges;
  const studyId = studyByKfId.data.studyByKfId.kfId;
  const tree = render(
    <AnalyticsProviderMock>
      <MemoryRouter>
        <MockedProvider>
          <FileCounts files={files} title={studyId} />
        </MockedProvider>
      </MemoryRouter>
    </AnalyticsProviderMock>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders FileFileCounts with empty file list', () => {
  const studyId = studyByKfId.data.studyByKfId.kfId;
  const tree = render(
    <AnalyticsProviderMock>
      <MemoryRouter>
        <MockedProvider>
          <FileCounts files={[]} title={studyId} />
        </MockedProvider>
      </MemoryRouter>
    </AnalyticsProviderMock>,
  );
  expect(tree.container).toMatchSnapshot();
});
