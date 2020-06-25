/* eslint-disable no-loop-func */
import React from 'react';
import wait from 'waait';
import {MockedProvider} from '@apollo/client/testing';
import {MemoryRouter} from 'react-router-dom';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId.json';
import {Segment, Button} from 'semantic-ui-react';
import {render, fireEvent, cleanup, act} from '@testing-library/react';
import EditDocumentForm from '../EditDocumentForm';

afterEach(cleanup);
jest.mock('draft-js/lib/generateRandomKey', () => () => '123');
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

let file = {
  lastModified: 1567797130510,
  name: 'organize.tsv',
  size: 7,
  type: 'text/tab-separated-values',
  webkitRelativePath: '',
};

const historyMock = {
  push: jest.fn(),
  location: {pathname: '/study/SD_8WX8QQ06/documents/new-documents'},
};
let errors = {};

it('Show warning message when input file name is similar to an existing file', async () => {
  const handleSubmit = jest.fn();

  const {container, getByTestId, queryAllByText} = render(
    <MockedProvider mocks={mocks}>
      <MemoryRouter
        initialEntries={['/study/SD_8WX8QQ06/documents/new-document']}
      >
        <EditDocumentForm
          studyFiles={studyByKfId.data.studyByKfId.files.edges}
          isAdmin={false}
          fileNode={file}
          handleSubmit={handleSubmit}
          errors={errors}
          history={historyMock}
          showFieldHints={true}
          submitButtons={(disabled, onUploading) => (
            <Segment vertical basic compact>
              <Button
                floated="right"
                type="submit"
                primary={errors.length === 0}
                disabled={disabled}
              >
                {onUploading && !errors ? 'UPLOADING ...' : 'UPLOAD'}
              </Button>
              <Button floated="right" primary={errors.length > 0}>
                CANCEL
              </Button>
            </Segment>
          )}
        />
      </MemoryRouter>
    </MockedProvider>,
  );

  await wait(0);

  //react portal w/ modal is added to document
  expect(document.querySelectorAll('.ui.form').length).toBe(1);
  expect(container).toMatchSnapshot();

  // Update file name with an existing file
  // this should make the form invalid and block submission
  const nameInput = getByTestId('name-input');
  act(() => {
    fireEvent.change(nameInput, {
      target: {value: studyByKfId.data.studyByKfId.files.edges[0].node.name},
    });
  });
  await wait();
  expect(container).toMatchSnapshot();

  expect(queryAllByText(/UPLOAD/).length).toBe(1);

  act(() => {
    fireEvent.click(queryAllByText(/Update Existing Document/i)[0]);
  });

  await wait();
  expect(container).toMatchSnapshot();
});
