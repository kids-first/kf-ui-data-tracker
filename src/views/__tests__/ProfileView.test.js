import React from 'react';
import wait from 'waait';
import {render, cleanup} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders profile view correctly', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks}
    >
      <MemoryRouter initialEntries={['/profile']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  await wait(10);

  expect(tree.container).toMatchSnapshot();
});

it('renders profile view -- shows an error', async () => {
  const tree = render(
    <MockedProvider mocks={[mocks[14]]}>
      <MemoryRouter initialEntries={['/profile']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(0);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText('Error')).not.toBeNull();
});
