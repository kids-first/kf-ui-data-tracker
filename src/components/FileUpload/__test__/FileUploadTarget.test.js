import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render} from 'react-testing-library';
import FileUploadTarget from '../FileUploadTarget';

it('renders correctly', () => {
  const tree = render(
    <MemoryRouter>
      <FileUploadTarget
        handleSelectedFile={jest.fn()}
        handleDragOver={jest.fn()}
        handleDragEnter={jest.fn()}
        handleDragLeave={jest.fn()}
        handleDrop={jest.fn()}
      />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders instructions', () => {
  const tree = render(
    <MemoryRouter>
      <FileUploadTarget
        instructions="Drag files here"
        handleSelectedFile={jest.fn()}
        handleDragOver={jest.fn()}
        handleDragEnter={jest.fn()}
        handleDragLeave={jest.fn()}
        handleDrop={jest.fn()}
      />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText('Drag files here')).not.toBeNull();
});

it('renders errors', () => {
  const tree = render(
    <MemoryRouter>
      <FileUploadTarget
        error={{graphQLErrors: [{message: 'something went wrong'}]}}
        handleSelectedFile={jest.fn()}
        handleDragOver={jest.fn()}
        handleDragEnter={jest.fn()}
        handleDragLeave={jest.fn()}
        handleDrop={jest.fn()}
      />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
  expect(tree.queryByText(/Failed to upload/)).not.toBeNull();
});
