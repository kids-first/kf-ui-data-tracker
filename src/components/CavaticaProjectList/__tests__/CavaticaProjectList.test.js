import React from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import CavaticaProjectList from '../CavaticaProjectList';

const projects = [
  {
    node: {
      id:
        'UHJvamVjdE5vZGU6a29sYm1hbmQvc2Qtd2dwOHJ3M3ctZ2F0ay1oYXBsb3R5cGVjYWxsZXI=',
      createdBy: 'kolbmand',
      createdOn: '2019-08-14T18:29:01+00:00',
      projectId: 'kolbmand/sd-wgp8rw3w-gatk-haplotypecaller',
      projectType: 'DEL',
      name: 'SD_WGP8RW3W gatk-haplotypecaller',
      workflowType: 'bwa_mem',
      deleted: true,
      study: {
        id: 'U3R1ZHlOb2RlOlNEX1dHUDhSVzNX',
        kfId: 'SD_WGP8RW3W',
        name: 'My Study',
        shortName: null,
      },
    },
  },
  {
    node: {
      id: 'UHJvamVjdE5vZGU6a2ZkcmMtaGFybW9uaXphdGlvbi9zZC1qd3MzdjI0ZC0wMI==',
      createdBy: 'kfdrc-harmonization',
      createdOn: '2019-05-21T14:13:00+00:00',
      projectId: 'kfdrc-harmonization/sd-jws3v24d-bwa-mem',
      projectType: 'HAR',
      name: 'Testing',
      workflowType: 'bwa_mem',
      deleted: false,
      study: null,
    },
  },
  {
    node: {
      id: 'UHJvamVjdE5vZGU6a2ZkcmMtaGFybW9uaXphdGlvbi9zZC1lMWJyMnRmaw==',
      createdBy: 'kfdrc-harmonization',
      createdOn: '2019-06-10T14:49:01+00:00',
      projectId: 'kfdrc-harmonization/sd-e1br2tfk',
      projectType: 'DEL',
      name: 'data harmonization',
      workflowType: 'bwa_mem',
      deleted: false,
      study: {
        id: 'U3R1ZHlOb2RlOlNEX1dHUDhSVzNX',
        kfId: 'SD_WGP8RW3W',
        name: 'Test Study',
        shortName: null,
      },
    },
  },
  {
    node: {
      id: 'UHJvamVjdE5vZGU6a2ZkcmMtaGFybW9uaXphdGlvbi9zZC1qd3MzdjI0ZC0wMQ==',
      createdBy: 'kfdrc-harmonization',
      createdOn: '2019-05-21T14:13:10+00:00',
      projectId: 'kfdrc-harmonization/sd-jws3v24d-01',
      projectType: 'HAR',
      name: 'Test Joint Genotyping',
      workflowType: 'bwa_mem',
      deleted: false,
      study: null,
    },
  },
];

it('renders cavatica project list correctly - default look', () => {
  const tree = render(
    <MemoryRouter initialEntries={['/cavatica-projects']}>
      <CavaticaProjectList projects={projects} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders cavatica project list correctly - no data', () => {
  const tree = render(
    <MemoryRouter initialEntries={['/cavatica-projects']}>
      <CavaticaProjectList />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});
