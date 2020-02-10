import React from 'react';
import wait from 'waait';
import {render, act, fireEvent, cleanup} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../__mocks__/kf-api-study-creator/mocks';
import myProfile from '../../../__mocks__/kf-api-study-creator/responses/myProfile.json';
import studyByKfId from '../../../__mocks__/kf-api-study-creator/responses/studyByKfId.json';
import allProjects from '../../../__mocks__/kf-api-study-creator/responses/allProjects.json';
import Routes from '../../Routes';
import {
  projectFormValidation,
  projectFormSubmission,
} from '../../modals/EditProjectModal';

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
    fireEvent.click(tree.queryAllByText(/Delivery/i)[0]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  // If choose Delivery, the workflow type selection, and project name input is hidden
  expect(tree.queryByText('Select a workflow type')).toBeNull();
  expect(tree.queryByText('Type in Project Name')).toBeNull();

  act(() => {
    fireEvent.click(tree.queryAllByText(/Delivery/i)[0]);
  });
  await wait();
  act(() => {
    fireEvent.click(tree.queryAllByText(/Analysis/i)[0]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  // If choose Analysis, the workflow type selection is shown, and project name input is hidden
  expect(tree.queryByText('Select a workflow type')).not.toBeNull();
  expect(tree.queryByText(/Project Name:/i)).toBeNull();

  act(() => {
    fireEvent.click(tree.getByText(/Select a workflow type/i));
  });
  await wait(10);
  expect(tree.container).toMatchSnapshot();
  act(() => {
    fireEvent.click(tree.queryAllByText(/bwa_mem_bqsr/i)[0]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();

  act(() => {
    fireEvent.click(tree.queryAllByText(/Analysis/i)[0]);
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Research/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  // If choose Analysis, the workflow type selection is hidden, and project name input is shown
  expect(tree.queryByText('Select a workflow type')).toBeNull();
  expect(tree.queryByText(/Project Name:/i)).not.toBeNull();

  act(() => {
    fireEvent.change(tree.getByTestId('workflow-input').children[0], {
      target: {value: 'wrong-workflow-type&&'},
    });
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
    fireEvent.click(tree.queryAllByText(/CREATE/i)[0]);
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
    fireEvent.click(tree.queryAllByText(/EDIT/i)[0]);
  });
  await wait();
  act(() => {
    fireEvent.click(tree.queryAllByText(/Delivery/i)[0]);
  });
  await wait();
  act(() => {
    fireEvent.click(tree.queryAllByText(/Analysis/i)[0]);
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  // If choose Analysis, the workflow type selection is shown, and project name input is hidden
  expect(tree.queryByText(/Workflow Type:/i)).not.toBeNull();
  expect(tree.queryByText(/Project Name:/i)).toBeNull();

  act(() => {
    fireEvent.click(tree.queryAllByText(/Analysis/i)[0]);
  });
  await wait();
  act(() => {
    fireEvent.click(tree.getByText(/Research/i));
  });
  await wait();
  expect(tree.container).toMatchSnapshot();
  // If choose Analysis, the workflow type selection  and project name input are hidden
  expect(tree.queryByText(/Workflow Type:/i)).toBeNull();
  expect(tree.queryByText(/Project Name:/i)).toBeNull();

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

it(`Test project creation/edit form submission`, async () => {
  const values = {
    study: 'U3R1ZHlOb2RlOlNEX0cwSEZDOURE',
    workflowType: 'test',
    projectType: 'RES',
  };
  const createProject = jest.fn(() =>
    Promise.resolve({
      data: {
        createProject: {
          project: {
            id: 'UHJvamVjdE5vZGU6emh1eDMvc2QtZzBoZmM5ZGQtYWE=',
            createdBy: 'zhux3',
            createdOn: '2020-02-04T15:51:40+00:00',
            description: '',
            modifiedOn: '2020-02-04T15:51:41+00:00',
            name: 'test study name test',
            projectType: 'RES',
            url:
              'https://cavatica-api.sbgenomics.com/v2/projects/zhux3/sd-g0hfc9dd-test',
            workflowType: 'test',
            deleted: false,
          },
        },
      },
    }),
  );
  const updateProject = jest.fn(() =>
    Promise.resolve({
      data: {
        updateProject: {
          project: {
            id: 'UHJvamVjdE5vZGU6emh1eDMvc2QtZzBoZmM5ZGQtYWE=',
            createdBy: 'zhux3',
            createdOn: '2020-02-04T15:51:40+00:00',
            description: '',
            modifiedOn: '2020-02-04T15:51:41+00:00',
            name: 'test study name test',
            projectType: 'RES',
            url:
              'https://cavatica-api.sbgenomics.com/v2/projects/zhux3/sd-g0hfc9dd-test',
            workflowType: 'test',
            deleted: false,
          },
        },
      },
    }),
  );
  const study = studyByKfId.data.studyByKfId;
  const projectNode = allProjects.data.allProjects.edges[0].node;
  const setHookState = jest.fn().mockImplementation(() => [{}, () => {}]);

  const submissionResultsA = projectFormSubmission(
    values,
    study,
    null,
    createProject,
    updateProject,
    setHookState,
    setHookState,
  );
  await wait();
  expect('data' in submissionResultsA.createProject);
  expect(!('updateProject)' in submissionResultsA));

  const submissionResultsB = projectFormSubmission(
    values,
    null,
    projectNode,
    createProject,
    updateProject,
    setHookState,
    setHookState,
  );
  await wait();
  expect('data' in submissionResultsB.updateProject);
  expect(!('createProject)' in submissionResultsB));

  const createProjectError = jest.fn(() =>
    Promise.reject({
      errors: [
        {
          message: 'Mock message for createProjectError',
          locations: [{line: 2, column: 3}],
          path: ['createProject'],
        },
      ],
      data: {createProject: null},
    }),
  );
  const updateProjectError = jest.fn(() =>
    Promise.reject({
      errors: [
        {
          message: 'Mock message for updateProjectError',
          locations: [{line: 2, column: 3}],
          path: ['updateProject'],
        },
      ],
      data: {updateProject: null},
    }),
  );

  const submissionResultsC = projectFormSubmission(
    values,
    study,
    null,
    createProjectError,
    updateProjectError,
    setHookState,
    setHookState,
  );
  await wait();
  expect(
    submissionResultsC.createProject.errors[0].message ===
      'Mock message for createProjectError',
  );
  expect(!Object.keys(submissionResultsC).includes('updateProject'));

  const submissionResultsD = projectFormSubmission(
    values,
    null,
    projectNode,
    createProjectError,
    updateProjectError,
    setHookState,
    setHookState,
  );
  await wait();
  expect(
    submissionResultsD.updateProject.errors[0].message ===
      'Mock message for updateProjectError',
  );
  expect(!Object.keys(submissionResultsD).includes('createProject'));
});
