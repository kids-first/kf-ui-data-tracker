import React from 'react';
import wait from 'waait';
import {render} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import CallbackView from '../CallbackView';

jest.mock('auth0-js');

it('renders callback view correctly with history mock', async () => {
  // browser mocks
  const historyMock = {
    push: jest.fn(),
    location: {pathname: '/study/SD_8WX8QQ06/documents/new-documents'},
  };

  const tree = render(
    <MockedProvider>
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/documents/new-documents']}
      >
        <CallbackView history={historyMock} />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);

  expect(tree.container).toMatchSnapshot();
});
