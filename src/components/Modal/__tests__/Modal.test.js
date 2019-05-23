import React from 'react';
import {render, cleanup} from 'react-testing-library';
import Modal from '../Modal';

afterEach(cleanup);
it('renders modal with no content, submit is enabled', async () => {
  const {container} = render(
    <Modal
      title="MODAL TITLE"
      onSubmit={() => {}}
      onCloseModal={() => {}}
      disableSubmit={false}
    />,
    {container: document.body},
  );
  expect(container).toMatchSnapshot();
});

it('renders modal with no content, submit is disabled', async () => {
  const {container} = render(
    <Modal
      title="MODAL TITLE"
      onSubmit={() => {}}
      onCloseModal={() => {}}
      disableSubmit={true}
    />,
    {container: document.body},
  );
  expect(container).toMatchSnapshot();
});
