/* eslint-disable no-loop-func */
import React from 'react';
import wait from 'waait';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {render, act, fireEvent, cleanup} from '@testing-library/react';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import NewDocumentView from '../NewDocumentView';
import Routes from '../../../Routes';
import ReactTestUtils from 'react-dom/test-utils';

jest.mock('auth0-js');
afterEach(cleanup);
jest.mock('draft-js/lib/generateRandomKey', () => () => '123');
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

let file = {
  lastModified: 1567797130510,
  name: 'organize.tsv',
  size: 7,
  type: 'text/tab-separated-values',
  webkitRelativePath: '',
};

const historyMock = {
  push: jest.fn(),
  location: {pathname: '/study/SD_8WX8QQ06/documents/new-documents'},
};

it('Render out the new document view', async () => {
  const tree = render(
    <MockedProvider mocks={[mocks[1], mocks[1], mocks[8], mocks[59]]}>
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/documents/new-document']}
      >
        <NewDocumentView
          match={{params: {kfId: 'SD_8WX8QQ06'}}}
          location={{state: {file: file}}}
          history={historyMock}
        />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait();

  expect(tree.container).toMatchSnapshot();

  // Put file name similar to an existing file
  const nameInput = tree.getByTestId('name-input');
  act(() => {
    fireEvent.change(nameInput, {
      target: {value: 'organization.jp'},
    });
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Put file name same to an existing file
  act(() => {
    fireEvent.change(nameInput, {
      target: {value: 'organization.jpeg'},
    });
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Add description
  const descriptionInput = tree.container.querySelector(
    '.public-DraftEditor-content',
  );
  act(() => {
    ReactTestUtils.Simulate.beforeInput(descriptionInput, {
      data: 'description input added',
    });
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Remove file title and description to expect warning
  act(() => {
    fireEvent.change(nameInput, {
      target: {value: ''},
    });
  });
  await wait();

  act(() => {
    ReactTestUtils.Simulate.beforeInput(descriptionInput, {
      data: '',
    });
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Add title and description to enable the upload
  act(() => {
    fireEvent.change(nameInput, {
      target: {value: 'name'},
    });
  });
  await wait();

  act(() => {
    ReactTestUtils.Simulate.beforeInput(descriptionInput, {
      data: 'description',
    });
  });
  await wait();

  // Select file type
  act(() => {
    fireEvent.click(tree.getByText(/Biospecimen Manifest/i));
  });

  await wait();

  // Click on the cancle button
  act(() => {
    fireEvent.click(tree.getByTestId('new-file-cancel'));
  });

  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the upload button
  act(() => {
    fireEvent.click(tree.getByTestId('new-file-submit'));
  });

  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('Render out the new document view with error on creation', async () => {
  const tree = render(
    <MockedProvider mocks={[mocks[1], mocks[1], mocks[8], mocks[60]]}>
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/documents/new-document']}
      >
        <NewDocumentView
          match={{params: {kfId: 'SD_8WX8QQ06'}}}
          location={{state: {file: file}}}
          history={historyMock}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
  const nameInput = tree.getByTestId('name-input');
  act(() => {
    fireEvent.change(nameInput, {
      target: {value: 'name'},
    });
  });
  await wait();
  const descriptionInput = tree.container.querySelector(
    '.public-DraftEditor-content',
  );
  act(() => {
    ReactTestUtils.Simulate.beforeInput(descriptionInput, {
      data: '#description',
    });
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Biospecimen Manifest/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  // Click on the upload button
  act(() => {
    fireEvent.click(tree.getByTestId('new-file-submit'));
  });
  await wait(1000);
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Failed to create the file/)).not.toBeNull();
});

it('renders new document view and redirect due to lack of location.state', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[1], mocks[1], mocks[8], mocks[59]]}
    >
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/documents/new-document']}
      >
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Study Documents/)).not.toBeNull();
});
