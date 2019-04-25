import React from 'react';
import wait from 'waait';
import {MockedProvider} from 'react-apollo/test-utils';
import {MemoryRouter} from 'react-router-dom';
import {render, fireEvent} from 'react-testing-library';
import StudyFilesListView from './StudyFilesListView';
import {mocks} from '../../__mocks__/kf-api-study-creator/mocks';

it('deletes a file correctly', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter initialEntries={['/study/SD_8WX8QQ06']}>
        <StudyFilesListView match={{params: {kfId: 'SD_8WX8QQ06'}}} />
      </MemoryRouter>
    </MockedProvider>,
  );
  await wait(0);

  const fileIds = tree.queryAllByText(/SF_/i).map(f => f.textContent);
  expect(fileIds.length).toBe(2);

  // Delete the second file
  fireEvent.click(tree.queryAllByText(/icon-delete/i)[1]);
  await wait();

  // Should only be one file now
  const newFileIds = tree.queryAllByText(/SF_/i).map(f => f.textContent);
  expect(newFileIds.length).toBe(1);
});
