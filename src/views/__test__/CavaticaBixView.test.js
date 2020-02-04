import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from 'react-testing-library';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import Routes from '../../Routes';
import {projectFormValidation} from '../../modals/EditProjectModal';

jest.mock('auth0-js');
afterEach(cleanup);

it('renders study Cavatica projects view correctly', async () => {
  const tree = render(
    <MockedProvider
      mocks={mocks}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/cavatica']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
    {
      container: document.body,
    },
  );
  expect(tree.container).toMatchSnapshot();

  await wait(10);

  expect(tree.container).toMatchSnapshot();

  // Click to open the create a research project modal with new workflow type
  act(() => {
    fireEvent.click(tree.getByText(/New Project/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Select a project type/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.getByText(/Delivery/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  // If choose Delivery, the workflow type selection is hidden
  expect(tree.queryByText('Select a workflow type')).toBeNull();

  act(() => {
    fireEvent.click(tree.getByText(/Delivery/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Research/i));
  });
  expect(tree.container).toMatchSnapshot();
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Select a workflow type/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.change(tree.getByTestId('workflow-input').children[0], {
      target: {value: 'wrong-workflow-type&&'},
    });
  });
  act(() => {
    fireEvent.click(tree.getByText(/Add/i));
  });
  act(() => {
    fireEvent.keyDown(tree.container, {
      key: 'Enter',
      code: 13,
    });
  });
  await wait();
  // Show error message
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.change(tree.getByTestId('workflow-input').children[0], {
      target: {value: 'correct-workflow-type'},
    });
  });

  act(() => {
    fireEvent.click(tree.getByText(/CREATE/i));
  });
  await wait();
  // No error message
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.keyDown(tree.container, {
      key: 'Escape',
      code: 27,
    });
  });

  // Click to open the link project modal
  act(() => {
    fireEvent.click(tree.getByText(/Link Project/i));
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Choose a project/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.keyDown(tree.container, {
      key: 'Escape',
      code: 27,
    });
  });

  // Click to open the edit project modal
  act(() => {
    fireEvent.click(tree.getByText(/EDIT/i));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('renders study Cavatica projects view correctly with warning', async () => {
  const tree = render(
    <MockedProvider
      mocks={[mocks[44], mocks[8], mocks[15]]}
      resolvers={{
        Query: {
          myProfile: _ => myProfile.data.myProfile,
        },
      }}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/cavatica']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText('Missing projects')).not.toBeNull();
});

it('renders study Cavatica projects view -- shows an error', async () => {
  const tree = render(
    <MockedProvider mocks={[mocks[16], mocks[1], mocks[8]]}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/cavatica']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(0);

  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText('Error')).not.toBeNull();
});

it('renders study Cavatica projects view -- empty view for regular user', async () => {
  var regularUser = myProfile.data.myProfile;
  regularUser.roles = ['USER'];

  const tree = render(
    <MockedProvider
      resolvers={{
        Query: {
          myProfile: _ => regularUser,
        },
      }}
      mocks={mocks}
    >
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06/cavatica']}>
        <Routes />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(10);

  expect(tree.container).toMatchSnapshot();
});

it(`Test project creation/edit form validation`, async () => {
  const validateResultsA = projectFormValidation({
    workflowType: '',
    projectType: '',
  });
  expect(validateResultsA.projectType === 'Required');
  expect(validateResultsA.workflowType === 'Required');

  const validateResultsB = projectFormValidation({
    workflowType: '*****',
    projectType: 'RES',
  });
  expect(validateResultsB.workflowType === 'No special characters allowed');

  const validateResultsC = projectFormValidation({
    workflowType: '',
    projectType: 'DEL',
  });
  expect(validateResultsC === {});
});
