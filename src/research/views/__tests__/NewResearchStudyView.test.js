import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../../Routes';

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
      mocks={[mocks[1], mocks[8], mocks[55]]}
    >
      <MemoryRouter initialEntries={['/study/new-study-selection']}>
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
    fireEvent.click(tree.getByTestId('research-card'));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.change(tree.getByLabelText('name'), {
      target: {value: 'benchmark extensible e-business'},
    });
  });
  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/Select Account/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByText(/D3b/i));
  });
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/SUBMIT/i));
  });
  await wait(3000);

  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText(/Network error: Failed to create the new research study/i),
  ).not.toBeNull();
});

it('renders new study view correctly', async () => {
  jest.setTimeout(30000);
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
      mocks={[
        mocks[54],
        mocks[54],
        mocks[1],
        mocks[8],
        mocks[40],
        mocks[1],
        mocks[40],
      ]}
    >
      <MemoryRouter initialEntries={['/study/new-study-selection']}>
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
    fireEvent.click(tree.getByTestId('research-card'));
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.change(tree.getByLabelText('name'), {
      target: {value: 'benchmark extensible e-business'},
    });
  });
  expect(tree.getByText(/Study Short Name/)).not.toBeNull();
  expect(tree.getByText(/Description/)).not.toBeNull();

  act(() => {
    fireEvent.click(tree.getByText(/Select Contacts/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByText(/Allison/i));
  });
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByText(/Dan/i));
  });
  expect(tree.container).toMatchSnapshot();
  // Submit button is disabled
  act(() => {
    fireEvent.click(tree.getByText(/SUBMIT/i));
  });

  act(() => {
    fireEvent.click(tree.getByText(/Select Account/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.getByText(/D3b/i));
  });
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/SUBMIT/i));
  });

  await wait(1500);

  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/Skip ahead to the research study/i));
  });

  act(() => {
    fireEvent.click(
      tree.getByText(
        /External study resources creation in progress. Click for details/i,
      ),
    );
  });

  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.keyDown(tree.container, {
      key: 'Escape',
      code: 27,
    });
  });

  await wait(100);
  expect(tree.container).toMatchSnapshot();
});
