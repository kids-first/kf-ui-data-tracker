import React from 'react';
import {
  fireEvent,
  render,
  cleanup,
  waitForElement,
} from '@testing-library/react';
import ToggleButtons from '../ToggleButtons';

afterEach(cleanup);

it('renders toggle button correctly', () => {
  const mockButtons = [
    {text: 'Grid', icon: 'grid layout'},
    {text: 'list', icon: 'list'},
  ];
  const tree = render(
    <ToggleButtons onToggle={jest.fn()} buttons={mockButtons} />,
  );
  const activeButton = tree.getByText(mockButtons[0].text);
  expect(tree.container).toMatchSnapshot();
  // only renders one active button
  expect(activeButton.className).toContain('active');
});

it('changes active button on click', async () => {
  const mockButtons = [
    {text: 'Grid', icon: 'grid layout'},
    {text: 'list', icon: 'list'},
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
  expect(activeButton.className).toContain('active');
});

it('calls onToggle prop on click', async () => {
  const mockOnToggle = jest.fn();
  const mockButtons = [
    {key: 'grid', text: 'Grid', icon: 'grid layout'},
    {key: 'list', text: 'List', icon: 'list'},
  ];
  const tree = render(
    <ToggleButtons onToggle={mockOnToggle} buttons={mockButtons} />,
  );
  fireEvent.click(tree.getByText('List'));
  const activeButton = await waitForElement(() =>
    tree.getByText(mockButtons[1].text),
  );
  expect(tree.container).toMatchSnapshot();
  // only gets called once
  expect(mockOnToggle.mock.calls.length).toBe(1);
  // returns an object with key value pair of {text: 'list'}
  expect(mockOnToggle.mock.calls[0][0].key).toBe('list');
  // renders the list button with the active state
  expect(activeButton.className).toContain('active');
});

it('renders toggle button in diffrent sizes', () => {
  const mockButtons = [
    {key: 'grid', text: 'Grid', icon: 'grid layout'},
    {key: 'list', text: 'List', icon: 'list'},
  ];
  const tree = render(
    <>
      <ToggleButtons onToggle={jest.fn()} buttons={mockButtons} size="medium" />
      <ToggleButtons onToggle={jest.fn()} buttons={mockButtons} size="large" />
    </>,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders toggle button hiding Text', () => {
  const mockButtons = [
    {key: 'grid', text: 'Grid', icon: 'grid layout'},
    {key: 'list', text: 'List', icon: 'list'},
  ];
  const tree = render(
    <>
      <ToggleButtons onToggle={jest.fn()} buttons={mockButtons} hideText />
    </>,
  );
  expect(tree.container).toMatchSnapshot();
});
