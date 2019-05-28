import React from 'react';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {render, fireEvent} from 'react-testing-library';
import Routes from '../../Routes';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';

jest.mock('auth0-js');

beforeAll(() => {
  // Always confirm prompts
  global.prompt = () => true;
  // Print alerts to console
  window.alert = () => true;

  // Needed to allow react-copy-to-clipboard to work in test renderer
  const getSelection = () => ({
    rangeCount: 0,
    addRange: () => {},
    getRangeAt: () => {},
    removeAllRanges: () => {},
  });

  window.getSelection = getSelection;
  document.getSelection = getSelection;
});

it('edits a file correctly', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/files']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  expect(tree.queryAllByText(/organization.jpeg/i).length).toBe(1);

  // Click on the first file's name to go to file detail page
  const fileName = tree.queryByTestId('edit-file');
  fireEvent.click(fileName);
  await wait();

  // Click on the file's edit button
  fireEvent.click(tree.getByText(/EDIT/));
  await wait();

  // Click edit button to edit the file name
  fireEvent.click(tree.queryByTestId('edit-name-button'));
  await wait();

  const nameInput = tree.getByTestId('name-input');
  fireEvent.change(nameInput, {target: {value: 'mynewfile.txt'}});

  // Click save icon
  fireEvent.click(tree.getByTestId('save-name-button'));
  await wait();

  // Update the description
  const descInput = tree.getByTestId('description-input');
  fireEvent.change(descInput, {target: {value: 'Some description here'}});
  await wait();

  // Click 'Annotate File' button to return to file listing
  fireEvent.click(tree.getByText(/annotate file/i));

  // Old name should have been updated
  expect(tree.queryAllByText(/organizaton.jpeg/i).length).toBe(0);
  expect(tree.queryAllByText(/mynewfile.txt/i).length).toBe(1);
});
