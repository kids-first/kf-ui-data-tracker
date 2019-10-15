import React from 'react';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {
  render,
  fireEvent,
  act,
  waitForElementToBeRemoved,
} from 'react-testing-library';
import Routes from '../../../../Routes';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';

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
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={mocks}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/documents/']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);

  expect(tree.container).toMatchSnapshot();

  expect(tree.queryAllByText(/organization.jpeg/i).length).toBe(1);
  expect(tree.queryAllByText(/Approved/).length).toBe(1);

  // Click on the first file's name to go to file detail page
  const fileName = tree.getByText(/organization.jpeg/i);
  act(() => {
    fireEvent.click(fileName);
  });
  await wait(10);

  // Click on the file's edit button to open annotation modal
  act(() => {
    fireEvent.click(tree.getByText(/EDIT/));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Update file name
  const nameInput = tree.getByTestId('name-input');
  act(() => {
    fireEvent.change(nameInput, {target: {value: 'foo bar file'}});
  });
  await wait();

  // Update file description
  const descInput = tree.getByTestId('description-input');
  act(() => {
    fireEvent.change(descInput, {target: {value: 'Some description here'}});
  });
  await wait();

  // Update approval status from 'Pending review' to 'Approved'
  act(() => {
    fireEvent.click(tree.getByText(/Pending review/));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Approved/));
  });
  await wait();
  expect(tree.queryAllByText(/SAVE/i).length).toBe(1);
  // Click 'Save' button to return to file detail view
  act(() => {
    fireEvent.click(tree.getByText(/SAVE/));
    // fireEvent.click(document.querySelector('.close.icon'));
  });

  // make sure our modal closes after save
  await waitForElementToBeRemoved(() => document.querySelector('.modals'));
  expect(document.querySelector('.modals')).toBeFalsy();

  // Expect to see the file name and description updated on detail view
  expect(tree.queryAllByText(/organizaton.jpeg/i).length).toBe(0);
  expect(tree.queryAllByText(/Some description here/i).length).toBe(1);
  expect(tree.queryAllByText(/foo bar file/i).length).toBe(1);

  // Expect to see the file status updated on detail view
  expect(tree.queryAllByText(/Approved/).length).toBe(2);

  expect(tree.container).toMatchSnapshot();

  // Click on the file's delete button to open delete confirm modal
  act(() => {
    fireEvent.click(tree.getByTestId('delete-button'));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on upload version button
  act(() => {
    fireEvent.click(tree.getByText(/UPLOAD VERSION/));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  // Close upload version modal
  act(() => {
    fireEvent.keyDown(tree.container, {key: 'esc', code: 13});
  });

  // Click on version file name to open version info modal
  act(() => {
    fireEvent.click(tree.getByText(/VersionFileName.js/));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
});
