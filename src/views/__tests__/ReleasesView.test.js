import React from 'react';
import wait from 'waait';
import {render, cleanup} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import {coordMocks} from '../../../__mocks__/kf-api-release-coordinator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders study releases view correctly', async () => {
  const tree = render(
    <MockedProvider
      mocks={mocks.concat([coordMocks.getStudyReleases])}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/releases']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  await wait(10);

  expect(tree.container).toMatchSnapshot();
});

it('renders study releases view correctly --  showing empty view for non-admin user', async () => {
  var regularUser = myProfile.data.myProfile;
  regularUser.roles = ['USER'];
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => regularUser,
        },
      }}
      mocks={mocks.concat([coordMocks.getStudyReleases])}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/releases']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText('You don’t have access to this page.'),
  ).not.toBeNull();
});

it('renders study releases view -- shows an error', async () => {
  const tree = render(
    <MockedProvider
      mocks={mocks.concat([coordMocks.getStudyReleasesError])}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/releases']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText('Error')).not.toBeNull();
});
