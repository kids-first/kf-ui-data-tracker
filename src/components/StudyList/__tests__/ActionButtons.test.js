import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from '@apollo/client/testing';
import {render} from '@testing-library/react';
import wait from 'waait';
import {MY_PROFILE} from '../../../../src/state/queries';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import ActionButtons from '../ActionButtons';
import allStudies from '../../../../__mocks__/kf-api-study-creator/responses/allStudies.json';

it('release version correctly', async () => {
  const myProfileMock = {
    request: {
      query: MY_PROFILE,
    },
    result: myProfile,
  };

  const tree = render(
    <MockedProvider mocks={[myProfileMock]}>
      <MemoryRouter>
        <ActionButtons study={allStudies.data.allStudies.edges[0].node} />
      </MemoryRouter>
    </MockedProvider>,
  );

  // Loading state
  expect(tree.container).toMatchSnapshot();
  await wait(0);
  // Normal state
  expect(tree.container).toMatchSnapshot();
});
