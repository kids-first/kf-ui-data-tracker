import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render} from 'react-testing-library';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';
import {MockedProvider} from 'react-apollo/test-utils';
import StudyInfo from '../StudyInfo';
import EditStudyModal from '../../../modals/EditStudyModal';

it('Study basic info page renders correctly', () => {
  const study = studyByKfId.data.studyByKfId;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <StudyInfo studyNode={study} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('Study basic info edit study modal renders correctly', async () => {
  const study = studyByKfId.data.studyByKfId;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <>
          <StudyInfo studyNode={study} />
          <EditStudyModal studyNode={study} />
        </>
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});
