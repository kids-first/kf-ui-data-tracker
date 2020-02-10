import React from 'react';
import {render, cleanup} from '@testing-library/react';
import {versionState} from '../../../common/enums';
import Badge from '../Badge';

afterEach(cleanup);
it('renders badges with all available state', async () => {
  const stateList = Object.keys(versionState);
  var i;
  for (i in stateList) {
    const {container} = render(<Badge state={stateList[i]} />);
    expect(container).toMatchSnapshot();
  }
});

it('renders badges in different sizes', async () => {
  const sizeList = [
    'mini',
    'tiny',
    'small',
    'medium',
    'large',
    'big',
    'huge',
    'massive',
  ];
  var i;
  for (i in sizeList) {
    const {container} = render(<Badge state="PEN" size={sizeList[i]} />);
    expect(container).toMatchSnapshot();
  }
});

it('renders badge with customized icon', async () => {
  const {container} = render(<Badge icon="star outline" />);
  expect(container).toMatchSnapshot();
});

it('renders badge on loading mode', async () => {
  const {container} = render(<Badge loading state={null} />);
  expect(container).toMatchSnapshot();
});

it('renders badge with missing values for size and state', async () => {
  const {container} = render(<Badge />);
  expect(container).toMatchSnapshot();
});
