import React from 'react';
import {
  fireEvent,
  render,
  cleanup,
  waitForElement,
} from 'react-testing-library';
import ToggleButtons from '../ToggleButtons';

afterEach(cleanup);

it('renders correctly', () => {
  const mockButtons = [
    {text: 'Grid', icon: 'resources'},
    {text: 'list', icon: 'study'},
  ];
  const tree = render(
    <ToggleButtons onToggle={jest.fn()} buttons={mockButtons} />,
  );
  const activeButton = tree.getByText(mockButtons[0].text);
  // console.log(activeButton.className);
  expect(tree.container).toMatchSnapshot();
  // only renders one active button
  expect(activeButton.className).toBe('Button Button--default Button--primary');
});

it('changes active button on click', async () => {
  const mockButtons = [
    {text: 'Grid', icon: 'resources'},
    {text: 'list', icon: 'study'},
  ];
  const tree = render(
    <ToggleButtons onToggle={jest.fn()} buttons={mockButtons} />,
  );
  fireEvent.click(tree.getByText('list'));
  const activeButton = await waitForElement(() =>
    tree.getByText(mockButtons[1].text),
  );
  expect(tree.container).toMatchSnapshot();
  // renders the list button with the active state
  expect(activeButton.className).toBe('Button Button--default Button--primary');
});

it('calls onToggle prop on click', async () => {
  const mockOnToggle = jest.fn();
  const mockButtons = [
    {text: 'Grid', icon: 'resources'},
    {text: 'list', icon: 'study'},
  ];
  const tree = render(
    <ToggleButtons onToggle={mockOnToggle} buttons={mockButtons} />,
  );
  fireEvent.click(tree.getByText('list'));
  const activeButton = await waitForElement(() =>
    tree.getByText(mockButtons[1].text),
  );
  expect(tree.container).toMatchSnapshot();
  // only gets called once
  expect(mockOnToggle.mock.calls.length).toBe(1);
  // returns an object with key value pair of {text: 'list'}
  expect(mockOnToggle.mock.calls[0][0].text).toBe('list');
  // renders the list button with the active state
  expect(activeButton.className).toBe('Button Button--default Button--primary');
});
