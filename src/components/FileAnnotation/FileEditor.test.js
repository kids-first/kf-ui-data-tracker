import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, fireEvent} from 'react-testing-library';
import FileEditor from './FileEditor';

it('renders correctly', () => {
  const tree = render(
    <MemoryRouter initialEntries={['/study/SD_00000000/files/SF_00000000']}>
      <FileEditor
        kfId="SF_00000000"
        description="lorem ipsum"
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        onNameChange={jest.fn()}
        selectFileType={jest.fn()}
      />
    </MemoryRouter>,
  );
  expect(tree).toMatchSnapshot();
});

it('shows editor for name and hides when saved', () => {
  const tree = render(
    <MemoryRouter initialEntries={['/study/SD_00000000/files/SF_00000000']}>
      <FileEditor
        kfId="SF_00000000"
        name="test"
        description="lorem ipsum"
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        onNameChange={jest.fn()}
        selectFileType={jest.fn()}
      />
    </MemoryRouter>,
  );
  // Default edit state
  expect(tree).toMatchSnapshot();

  // Click on edit icon and enter edit mode
  const editButton = tree.getByText('icon-edit');
  fireEvent.click(editButton);
  expect(tree).toMatchSnapshot();

  // Click on save icon and return to default state
  let saveButton = tree.getByText('icon-save');
  fireEvent.click(saveButton);
  expect(tree).toMatchSnapshot();
});

it('renders selected file type correctly', () => {
  const tree = render(
    <MemoryRouter initialEntries={['/study/SD_00000000/files/SF_00000000']}>
      <FileEditor
        kfId="SF_00000000"
        description="lorem ipsum"
        fileType={'CLN'}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        onNameChange={jest.fn()}
        selectFileType={jest.fn()}
      />
    </MemoryRouter>,
  );
  expect(tree).toMatchSnapshot();
});
