import React from 'react';
import {render} from '@testing-library/react';
import Release from '../Release';
import getStudyReleases from '../../../../__mocks__/kf-api-release-coordinator/responses/getStudyReleases.json';

it('release version correctly', () => {
  const tree = render(
    <Release release={getStudyReleases.data.study.releases.edges[0].node} />,
  );
  expect(tree.container).toMatchSnapshot();
});
