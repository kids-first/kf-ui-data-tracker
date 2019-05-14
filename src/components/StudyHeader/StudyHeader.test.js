import React from 'react';
import {render} from 'react-testing-library';
import StudyHeader from './StudyHeader';

it('renders correctly', () => {
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
