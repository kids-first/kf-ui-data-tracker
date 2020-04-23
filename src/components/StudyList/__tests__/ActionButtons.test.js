import React from 'react';
import {MemoryRouter} from 'react-router-dom';
import {render, fireEvent} from '@testing-library/react';
import ActionButtons from '../ActionButtons';
import allStudies from '../../../../__mocks__/kf-api-study-creator/responses/allStudies.json';

it('release version correctly', () => {
  const tree = render(
    <MemoryRouter>
      <ActionButtons study={allStudies.data.allStudies.edges[0].node} />
    </MemoryRouter>,
  );
  expect(tree.container).toMatchSnapshot();
});
