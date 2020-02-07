import React from 'react';
import {render, cleanup, fireEvent, act} from '@testing-library/react';
import {mocks} from '../../../../__mocks__/kf-api-study-creator/mocks';
import {MockedProvider} from '@apollo/react-testing';
import CopyButton from '../CopyButton';

/* Sets up some browser functions that are needed for react-copy-to-clipboard
 * that do not exist in the test renderer
 */
beforeAll(() => {
  // Always confirm prompts
  global.prompt = () => true;
  // Print alerts to console
  window.alert = () => true;

  // Needed to allow react-copy-to-clipboard to work in test renderer
  const getSelection = () => ({
    rangeCount: 0,
    addRange: () => {},
    getRangeAt: () => {},
    removeAllRanges: () => {},
  });

  window.getSelection = getSelection;
  document.getSelection = getSelection;
});

afterEach(cleanup);

it('Copy Button renders correctly -- default style', async () => {
  const tree = render(
    <MockedProvider mocks={mocks}>
      <CopyButton text="testing1" />
    </MockedProvider>,
  );
  expect(tree.container).toMatchSnapshot();

  // Click on the copy button
  act(() => {
    fireEvent.click(tree.getByText(/testing1/));
  });
});

it('Copy Button renders correctly -- customized style', () => {
  const {container} = render(
    <CopyButton text="testing2" primary basic size="large" />,
  );
  expect(container).toMatchSnapshot();
});

it('Copy Button renders correctly -- customized tooltip', () => {
  const {container} = render(
    <CopyButton
      text="testing3"
      tooltip="tooltip text"
      position="bottom center"
    />,
  );
  expect(container).toMatchSnapshot();
});

it('Copy Button renders correctly -- customized button icon and text', () => {
  const {container} = render(
    <CopyButton text="COPY BUTTON" textToCopy="testing4" icon="star outline" />,
  );
  expect(container).toMatchSnapshot();
});
