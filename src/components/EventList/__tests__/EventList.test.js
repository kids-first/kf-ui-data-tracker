import React from 'react';
import {render} from 'react-testing-library';
import studyByKfId from '../../../../__mocks__/kf-api-study-creator/responses/studyByKfId';
import EventList from '../EventList';

it('Event list renders correctly', () => {
  const events = studyByKfId.data.studyByKfId.events.edges;
  const tree = render(<EventList events={events} />);
  expect(tree.container).toMatchSnapshot();
});
