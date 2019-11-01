import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from 'react-testing-library';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders admin event logs view correctly', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[11], mocks[13], mocks[0]]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/events']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  await wait(10);

  expect(tree.container).toMatchSnapshot();

  // Click on the user dropdown
  act(() => {
    fireEvent.click(tree.getByText(/User/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the study dropdown
  act(() => {
    fireEvent.click(tree.getByText(/Study/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the event type dropdown
  act(() => {
    fireEvent.click(tree.getByText(/Event Type/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});
