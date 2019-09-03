import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render} from 'react-testing-library';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';
import {MockedProvider} from 'react-apollo/test-utils';
import StudyInfo from '../StudyInfo';
import EditStudyModal from '../../../modals/EditStudyModal';
import NewProjectModal from '../../../modals/NewProjectModal';
import LinkProjectModal from '../../../modals/LinkProjectModal';

it('Study basic info page renders correctly', () => {
  const study = studyByKfId.data.studyByKfId;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <StudyInfo studyNode={study} />
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('Study basic info edit study modal renders correctly', async () => {
  const study = studyByKfId.data.studyByKfId;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <>
          <StudyInfo studyNode={study} />
          <EditStudyModal studyNode={study} />
        </>
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('Study basic info new project modal renders correctly', async () => {
  const study = studyByKfId.data.studyByKfId;
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <>
          <StudyInfo studyNode={study} />
          <NewProjectModal study={study} />
        </>
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('Study basic info link project modal renders correctly', async () => {
  const study = studyByKfId.data.studyByKfId;
  const projects = {
    edges: [
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
          study: {
            id: 'U3R1ZHlOb2RlOlNEX1dHUDhSVzNX',
            kfId: 'SD_WGP8RW3W',
            name: null,
            shortName: null,
          },
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
          study: null,
        },
      },
      {
        node: {
          id:
            'UHJvamVjdE5vZGU6a2ZkcmMtaGFybW9uaXphdGlvbi9zZC1qd3MzdjI0ZC0wMQ==',
          createdBy: 'kfdrc-harmonization',
          createdOn: '2019-05-21T14:13:10+00:00',
          projectId: 'kfdrc-harmonization/sd-jws3v24d-01',
          projectType: 'DEL',
          name: 'Test Joint Genotyping',
          workflowType: 'bwa_mem',
          study: null,
        },
      },
    ],
  };
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <>
          <StudyInfo studyNode={study} />
          <LinkProjectModal study={study} allProjects={projects} />
        </>
      </MemoryRouter>
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();
});
