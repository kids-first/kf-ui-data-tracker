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

it('renders new study view correctly', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[21]]}
    >
      <MemoryRouter initialEntries={['/study/new-study/info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
    {
      container: document.body,
    },
  );
  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.change(tree.getByLabelText('name'), {
      target: {value: 'benchmark extensible e-business'},
    });
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/NEXT/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.change(tree.getByLabelText('externalId'), {
      target: {value: 'benchmark extensible e-business'},
    });
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/NEXT/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/SUBMIT/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getAllByTestId('new-study-confirm')[0]);
  });
  expect(tree.container).toMatchSnapshot();

  await wait(1000);

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/Basic Info/i));
  });

  await wait(1000);

  expect(tree.container).toMatchSnapshot();
});

it('renders new study view correctly --  with error on submit', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[22]]}
    >
      <MemoryRouter initialEntries={['/study/new-study/info']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
    {
      container: document.body,
    },
  );
  await wait();

  act(() => {
    fireEvent.change(tree.getByLabelText('name'), {
      target: {value: 'benchmark extensible e-business'},
    });
  });
  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/External/i));
  });
  await wait();

  act(() => {
    fireEvent.change(tree.getByLabelText('externalId'), {
      target: {value: 'benchmark extensible e-business'},
    });
  });
  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/Logistics/i));
  });
  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/SUBMIT/i));
  });
  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/Cancel/i));
  });
  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/SUBMIT/i));
  });
  await wait();

  act(() => {
    fireEvent.click(tree.getAllByTestId('new-study-confirm')[0]);
  });

  await wait(3000);

  expect(tree.container).toMatchSnapshot();
});
