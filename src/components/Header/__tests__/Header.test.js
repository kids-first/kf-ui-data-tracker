import React from 'react';
import wait from 'waait';
import {render, fireEvent, act} from 'react-testing-library';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Header from '../Header';
import Routes from '../../../Routes';

jest.mock('auth0-js');

it('renders correctly -- default stage (USER role)', async () => {
  const tree = render(
    <MockedProvider
      mocks={mocks}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait(10);

  expect(tree.container).toMatchSnapshot();

  // Show admin dropwdown
  act(() => {
    fireEvent.click(tree.getByText(/Admin/));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Show user dropwdown
  act(() => {
    fireEvent.click(tree.getByText(/bendolly/));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Logout
  act(() => {
    fireEvent.click(tree.getByText(/Logout/));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/Click here to login/));
  });
});

it('renders correctly -- loading stage (USER role)', () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <Header data={{loading: true}} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});
