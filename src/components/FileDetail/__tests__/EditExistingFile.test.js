import React from 'react';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {render, fireEvent} from 'react-testing-library';
import Routes from '../../../Routes';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';

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

it('edits an existing file correctly', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/documents/']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();

  expect(tree.queryAllByText(/organization.jpeg/i).length).toBe(1);
  expect(tree.queryAllByText(/Approved/).length).toBe(0);

  // Click on the first file's name to go to file detail page
  const fileName = tree.getByText(/organization.jpeg/i);
  fireEvent.click(fileName);
  await wait();

  // Click on the file's edit button to open annotation modal
  fireEvent.click(tree.getByText(/EDIT/));
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Update file name
  const nameInput = tree.getByTestId('name-input');
  fireEvent.change(nameInput, {target: {value: 'mynewfile.txt'}});
  await wait();

  // Update file description
  const descInput = tree.getByTestId('description-input');
  fireEvent.change(descInput, {target: {value: 'Some description here'}});
  await wait();

  // Update approval status from 'Pending Review' to 'Approved'
  fireEvent.click(tree.getByTestId('status-dropdown'));
  await wait();
  fireEvent.click(tree.getByText(/Approved/));
  await wait();

  // Click 'Save' button to return to file detail view
  fireEvent.click(tree.getByText(/SAVE/));
  await wait();

  // Expect to see the file name and description updated on detail view
  expect(tree.queryAllByText(/organizaton.jpeg/i).length).toBe(0);
  expect(tree.queryAllByText(/Some description here/i).length).toBe(1);
  expect(tree.queryAllByText(/mynewfile.txt/i).length).toBe(1);

  // Expect to see the file status updated on detail view
  expect(tree.queryAllByText(/Approved/).length).toBe(1);

  expect(tree.container).toMatchSnapshot();
});
