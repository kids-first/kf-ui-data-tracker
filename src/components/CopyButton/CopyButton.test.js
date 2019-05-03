import React from 'react';
import {act} from 'react-dom/test-utils';
import {render} from 'react-testing-library';
import CopyButton from './CopyButton';

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

it('renders correctly', () => {
  const tree = render(<CopyButton text="testing" />);
  expect(tree).toMatchSnapshot();
});

it('displays checkmark svg on click', () => {
  jest.useFakeTimers();
  const tree = render(<CopyButton text="testing" />);

  // There should be no ✔ yet, only an Icon
  expect(tree.container.querySelector('span.CopyButton')).toBeNull();
  expect(tree.container.firstChild).toMatchSnapshot();

  let button = tree.container.querySelector('button');
  button.click();

  // Icon should be replaced with ✔
  expect(tree.container.querySelector('span.CopyButton')).not.toBeNull();
  expect(tree.container.firstChild).toMatchSnapshot();

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // ✔ should have change back to an Icon
  expect(tree.container.querySelector('span.CopyButton')).toBeNull();
  expect(tree.container.firstChild).toMatchSnapshot();
});
