import React from 'react';
import {render} from 'react-testing-library';
import StudyHeader from '../StudyHeader';

it('renders study header with study name and short name', () => {
  const tree = render(
    <StudyHeader
      kfId="SD_00000000"
      shortName="Test Study"
      name="A study used for testing the header"
      modifiedAt={'2019-01-01'}
    />,
  );
  expect(tree.container).toMatchSnapshot();
});

it('renders study header in loading stage', () => {
  const tree = render(<StudyHeader loading />);
  expect(tree.container).toMatchSnapshot();
});

it('renders study header with no data', () => {
  const tree = render(<StudyHeader />);
  expect(tree.container).toMatchSnapshot();
});

it('renders study header with different study creation status -- creating', () => {
  const tree = render(
    <StudyHeader
      kfId="SD_00000000"
      shortName="Test Study"
      name="A study used for testing the header"
      modifiedAt={'2019-01-01'}
      newStudy={['SD_00000000_STR']}
    />,
  );
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText(
      /External study resources creation in progress. Click for details./i,
    ),
  ).not.toBeNull();
});

it('renders study header with different study creation status -- err', () => {
  const tree = render(
    <StudyHeader
      kfId="SD_00000000"
      shortName="Test Study"
      name="A study used for testing the header"
      modifiedAt={'2019-01-01'}
      newStudy={['SD_00000000_ERR']}
    />,
  );
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText(
      'Error(s) creating external study resources. Click for details.',
    ),
  ).not.toBeNull();
});

it('renders study header with different study creation status -- created', () => {
  const tree = render(
    <StudyHeader
      kfId="SD_00000000"
      shortName="Test Study"
      name="A study used for testing the header"
      modifiedAt={'2019-01-01'}
      newStudy={['SD_00000000_SUC']}
    />,
  );
  expect(tree.container).toMatchSnapshot();
  expect(
    tree.queryByText(/External study resources created! Click for details./i),
  ).not.toBeNull();
});
