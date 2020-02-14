import React from 'react';
import wait from 'waait';
import {render, fireEvent, act} from '@testing-library/react';
import {MockedProvider} from '@apollo/react-testing';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import LinkStudyPopup from '../LinkStudyPopup';

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

it('renders the popup correctly', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <LinkStudyPopup project={project.node} />
    </MockedProvider>,
  );
  // Wait for all studies query to run
  await wait();

  expect(tree.container).toMatchSnapshot();

  // Trigger the popup with dropdown
  act(() => {
    fireEvent.click(tree.getByText(/LINK STUDY/));
  });

  expect(tree.container).toMatchSnapshot();
});
