import React from 'react';
import wait from 'waait';
import {render, fireEvent, act} from 'react-testing-library';
import {MemoryRouter} from 'react-router-dom';
import {MockedProvider} from '@apollo/react-testing';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import CavaticaProjectItem from '../CavaticaProjectItem';

const project = {
  node: {
    id:
      'UHJvamVjdE5vZGU6a29sYm1hbmQvc2Qtd2dwOHJ3M3ctZ2F0ay1oYXBsb3R5cGVjYWxsZXI=',
    createdBy: 'kolbmand',
    createdOn: '2019-08-14T18:29:01+00:00',
    projectId: 'kolbmand/sd-wgp8rw3w-gatk-haplotypecaller',
    projectType: 'DEL',
    name: 'SD_WGP8RW3W gatk-haplotypecaller',
    workflowType: 'bwa_mem',
    study: {
      id: 'U3R1ZHlOb2RlOlNEX1dHUDhSVzNX',
      kfId: 'SD_WGP8RW3W',
      name: null,
      shortName: null,
    },
  },
};

it('renders cavatica project item - show unlink project button', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/cavatica-projects']}>
        <CavaticaProjectItem
          projectNode={project.node}
          unlinkProject={jest.fn()}
        />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  // Click on the unlink project button
  act(() => {
    fireEvent.click(tree.getByText(/UNLINK/));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('renders cavatica project item - show edit button', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/cavatica-projects']}>
        <CavaticaProjectItem projectNode={project.node} editable={true} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  // Click on the edit project button
  act(() => {
    fireEvent.click(tree.getByText(/EDIT/));
  });
  await wait();

  expect(tree.container).toMatchSnapshot();
});

it('renders cavatica project item - show unlink project button', () => {
  const tree = render(
    <MemoryRouter initialEntries={['/cavatica-projects']}>
      <CavaticaProjectItem
        projectNode={project.node}
        unlinkProject={jest.fn()}
      />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders cavatica project item - disable cavatica link', () => {
  const tree = render(
    <MemoryRouter initialEntries={['/cavatica-projects']}>
      <CavaticaProjectItem projectNode={project.node} disableLink={true} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders cavatica project item - hide study link', () => {
  const tree = render(
    <MemoryRouter initialEntries={['/cavatica-projects']}>
      <CavaticaProjectItem projectNode={project.node} hideStudy={true} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});
