import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from 'react-testing-library';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../Routes';

jest.mock('auth0-js');
afterEach(cleanup);

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
  await wait(3000);

  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText(/Network error: Failed to create the new study/i),
  ).not.toBeNull();
});

it('renders new study view correctly', async () => {
  // browser sessionStorage mocks
  const sessionStorageMock = (function() {
    let store = {newStudy: 'SD_00000000_SUC'};
    return {
      getItem: function(key) {
        return store[key] || null;
      },
      setItem: function(key, value) {
        store[key] = value.toString();
      },
      removeItem: function(key) {
        delete store[key];
      },
      clear: function() {
        store = {};
      },
    };
  })();

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });

  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[8], mocks[21], mocks[40], mocks[1]]}
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

  await wait(1500);

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/Skip ahead to the study/i));
  });

  await wait(100);

  expect(tree.container).toMatchSnapshot();
});
