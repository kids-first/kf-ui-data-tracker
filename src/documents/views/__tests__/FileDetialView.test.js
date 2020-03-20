import React from 'react';
import wait from 'waait';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {render} from '@testing-library/react';
import Routes from '../../../Routes';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';

jest.mock('auth0-js');

it('render file detail view with an error', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[69]]}
    >
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/documents/SF_5ZPEMOOO']}
      >
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText(/Failed to get the file information/i),
  ).not.toBeNull();
});
