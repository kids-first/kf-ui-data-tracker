import React from 'react';
import {act} from 'react-dom/test-utils';
import {render, fireEvent} from 'react-testing-library';
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
