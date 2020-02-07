import React from 'react';
import {render} from '@testing-library/react';
import EditDocumentForm from '../EditDocumentForm';

it('renders correctly for annotating new file before upload', () => {
  const cancelMock = jest.fn();
  const submitMock = jest.fn();
  const tree = render(
    <EditDocumentForm handleCancel={cancelMock} handleSubmit={submitMock} />,
  );
  expect(tree).toMatchSnapshot();
});

it('renders correctly for editing existing file', () => {
  const tree = render(
    <EditDocumentForm
      fileType="CLN"
      fileName="Existing File Name"
      fileDescription="Existing File Description"
      versionStatus="PEN"
      onNameChange={e => e.preventDefault()}
      onDescriptionChange={e => e.preventDefault()}
      onFileTypeChange={e => e.preventDefault()}
      onVersionStatusChange={versionStatusValue => {}}
    />,
  );
  expect(tree).toMatchSnapshot();
});
