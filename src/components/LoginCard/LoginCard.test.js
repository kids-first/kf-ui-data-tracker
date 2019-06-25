import React from 'react';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {render} from 'react-testing-library';
import LoginCard from './LoginCard';

jest.mock('auth0-js');

it('renders correctly', async () => {
  jest.mock('../../state/auth');
  const tree = render(
    <MockedProvider>
      <MemoryRouter initialEntries={['/login']}>
        <LoginCard />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(0);
  expect(tree).toMatchSnapshot();
});
