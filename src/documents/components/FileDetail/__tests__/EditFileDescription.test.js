import React from 'react';
import wait from 'waait';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {render, fireEvent, act} from '@testing-library/react';
import ReactTestUtils from 'react-dom/test-utils';
import Routes from '../../../../Routes';
import {mocks} from '../../../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../../../__mocks__/kf-api-study-creator/responses/myProfile.json';

jest.mock('auth0-js');
jest.mock('draft-js/lib/generateRandomKey', () => () => '123');
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

it('edits an existing file description', async () => {
  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
      mocks={[mocks[4], mocks[5], mocks[64], mocks[8], mocks[1]]}
    >
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/documents/SF_5ZPEM167']}
      >
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait();
  expect(tree.container).toMatchSnapshot();

  // Click on the file's description edit button to open markdown editor
  act(() => {
    fireEvent.click(tree.getByText(/Edit/));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Click on the file's description markdown cancel button to go back
  act(() => {
    fireEvent.click(tree.getByText(/Cancel/));
  });
  await wait();

  act(() => {
    fireEvent.click(tree.getByText(/Edit/));
  });
  await wait();

  // Update file description adding a table markdown
  const descriptionInput = tree.container.querySelector(
    '.public-DraftEditor-content',
  );
  act(() => {
    ReactTestUtils.Simulate.beforeInput(descriptionInput, {
      data:
        '| Tables | Are | Cool | |----------|:-------------:|------:| | col 1 is | left-aligned | $1600 | | col 2 is | centered | $12 | | col 3 is | right-aligned | $1 |\n',
    });
  });

  await wait();
  expect(tree.container).toMatchSnapshot();

  // Click 'Save' button to return to exit out the editor
  act(() => {
    fireEvent.click(tree.getByText(/Save/));
  });
  await wait(100);

  expect(tree.container).toMatchSnapshot();
});
