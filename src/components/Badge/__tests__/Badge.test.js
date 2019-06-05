import React from 'react';
import {render, cleanup} from 'react-testing-library';
import {versionState} from '../../../common/fileUtils';
import Badge from '../Badge';

afterEach(cleanup);
it('renders badges with all available state', async () => {
  const stateList = Object.keys(versionState);
  var i;
  for (i in stateList) {
    const {container} = render(<Badge state={stateList[i]} />, {
      container: document.body,
    });
    expect(container).toMatchSnapshot();
  }
});

it('renders badge on loading mode', async () => {
  const {container} = render(<Badge loading state={null} />, {
    container: document.body,
  });
  expect(container).toMatchSnapshot();
});
