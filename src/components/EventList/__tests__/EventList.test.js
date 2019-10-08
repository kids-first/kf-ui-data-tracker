import React from 'react';
import {render, cleanup} from 'react-testing-library';
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';
import EventList from '../EventList';

afterEach(cleanup);
it('Event list renders correctly -- with mock data', () => {
  const events = studyByKfId.data.studyByKfId.events.edges;
  const tree = render(<EventList events={events} />);
  expect(tree.container).toMatchSnapshot();
});

it('Event list renders correctly -- with no data', () => {
  const tree = render(<EventList />);
  expect(tree.container).toMatchSnapshot();
});
