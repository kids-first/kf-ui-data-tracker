import React from 'react';
import {render} from 'react-testing-library';
import NewDocumentForm from './NewDocumentForm';

it('renders correctly', () => {
  const cancelMock = jest.fn();
  const submitMock = jest.fn();
  const tree = render(
    <NewDocumentForm handleCancel={cancelMock} handleSubmit={submitMock} />,
  );
  expect(tree).toMatchSnapshot();
});
