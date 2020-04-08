import React from 'react';
import wait from 'waait';
import {render, fireEvent, act} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import {coordMocks} from '../../../../__mocks__/kf-api-release-coordinator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Header from '../Header';
import Routes from '../../../Routes';

jest.mock('auth0-js');

it('renders correctly -- default stage (USER role)', async () => {
  const tree = render(
    <MockedProvider
      mocks={mocks.concat([coordMocks.allReleaseStudies])}
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
  expect(tree.container).toMatchSnapshot();

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
    fireEvent.click(tree.getByText(/devadmin/));
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
    <MockedProvider mocks={mocks.concat([coordMocks.allReleaseStudies])}>
      <MemoryRouter>
        <Header data={{loading: true}} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});
