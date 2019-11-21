/* eslint-disable no-loop-func */
import React from 'react';
import wait from 'waait';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {render, act, fireEvent, cleanup} from 'react-testing-library';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import NewDocumentView from '../NewDocumentView';

afterEach(cleanup);

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
    <MockedProvider mocks={mocks}>
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

  // Select file type
  act(() => {
    fireEvent.click(tree.getByText(/Biospecimen Manifest/i));
  });

  await wait();

  // Add description
  const descriptionInput = tree.getByTestId('description-input');
  act(() => {
    fireEvent.change(descriptionInput, {
      target: {value: 'description input added'},
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
    fireEvent.change(descriptionInput, {
      target: {value: ''},
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
    fireEvent.change(descriptionInput, {
      target: {value: 'description'},
    });
  });
  await wait();

  // Click on the cancle button
  act(() => {
    fireEvent.click(tree.getByText(/CANCEL/i));
  });

  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the upload button
  act(() => {
    fireEvent.click(tree.getByText(/UPLOAD/i));
  });

  await wait();

  expect(tree.container).toMatchSnapshot();
});
