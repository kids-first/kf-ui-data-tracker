import React from 'react';
import {render} from 'react-testing-library';
import ProgressBar from '../ProgressBar';

it('renders progress bar with 0/3 completed', () => {
  const values = {
    bucket: '',
    name: '',
    shortName: '',
  };
  const tree = render(<ProgressBar values={values} step={0} />);
  expect(tree.container).toMatchSnapshot();
});

it('renders progress bar with 2/3 completed', () => {
  const values = {
    bucket: '',
    name: 'incubate dynamic content',
    shortName: 'shortName',
  };
  const tree = render(<ProgressBar values={values} step={0} />);
  expect(tree.container).toMatchSnapshot();
});

it('renders progress bar with 3/3 completed', () => {
  const values = {
    bucket: 'authority-result',
    name: 'incubate dynamic content',
    shortName: 'shortName',
  };
  const tree = render(<ProgressBar values={values} step={0} />);
  expect(tree.container).toMatchSnapshot();
});

it('renders progress bar in (no data) error stage', () => {
  const tree = render(<ProgressBar />);
  expect(tree.container).toMatchSnapshot();
});

it('renders progress bar in (invalid data) error stage', () => {
  const tree = render(<ProgressBar step={4} />);
  expect(tree.container).toMatchSnapshot();
});
