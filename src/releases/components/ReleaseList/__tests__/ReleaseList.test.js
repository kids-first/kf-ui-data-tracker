import React from 'react';
import {render, cleanup} from '@testing-library/react';
import getStudyReleases from '../../../../__mocks__/kf-api-release-coordinator/responses/getStudyReleases.json';
import ReleaseList from '../ReleaseList';

afterEach(cleanup);
it('renders ReleaseList on loading stage', async () => {
  const {container} = render(<ReleaseList loading releases={[]} />);
  expect(container).toMatchSnapshot();
});

it('renders ReleaseList on empty stage', async () => {
  const {container} = render(<ReleaseList releases={[]} />);
  expect(container).toMatchSnapshot();
});

it('renders ReleaseList on normal stage', async () => {
  const releases = getStudyReleases.data.study.releases.edges;
  const {container} = render(<ReleaseList releases={releases} />);
  expect(container).toMatchSnapshot();
});
