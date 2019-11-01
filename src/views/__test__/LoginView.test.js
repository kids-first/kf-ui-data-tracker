import React from 'react';
import wait from 'waait';
import {render} from 'react-testing-library';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import Routes from '../../Routes';

jest.mock('auth0-js');

it('redirect user back to login view when there is no auth data', async () => {
  // browser mocks
  const localStorageMock = (function() {
    let store = {};
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

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  const tree = render(
    <MockedProvider>
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/documents/new-documents']}
      >
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);

  expect(tree.container).toMatchSnapshot();
});
