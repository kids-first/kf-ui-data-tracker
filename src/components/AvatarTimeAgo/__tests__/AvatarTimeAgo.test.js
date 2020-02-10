import React from 'react';
import {render, cleanup} from '@testing-library/react';
import AvatarTimeAgo from '../AvatarTimeAgo';

afterEach(cleanup);
it('renders AvatarTimeAgo showing username', async () => {
  const creator = {
    username: 'username',
    picture: 'https://www.w3schools.com/w3images/avatar6.png',
  };
  const createdAt = '2019-04-17T16:39:34+00:00';
  const {container} = render(
    <AvatarTimeAgo
      size="tiny"
      showUsername
      creator={creator}
      createdAt={createdAt}
    />,
  );
  expect(container).toMatchSnapshot();
});

it('renders AvatarTimeAgo not showing username', async () => {
  const creator = {
    username: 'username',
    picture: 'https://www.w3schools.com/w3images/avatar6.png',
  };
  const createdAt = '2019-04-17T16:39:34+00:00';
  const {container} = render(
    <AvatarTimeAgo size="mini" creator={creator} createdAt={createdAt} />,
  );
  expect(container).toMatchSnapshot();
});

it('renders AvatarTimeAgo without creator data', async () => {
  const createdAt = '2019-04-17T16:39:34+00:00';
  const {container} = render(
    <AvatarTimeAgo size="mini" createdAt={createdAt} />,
  );
  expect(container).toMatchSnapshot();
});

it('renders AvatarTimeAgo without createdAt data', async () => {
  const creator = {
    username: 'username',
    picture: 'https://www.w3schools.com/w3images/avatar6.png',
  };
  const {container} = render(<AvatarTimeAgo size="mini" creator={creator} />);
  expect(container).toMatchSnapshot();
});

it('renders AvatarTimeAgo without any data', async () => {
  const {container} = render(<AvatarTimeAgo />);
  expect(container).toMatchSnapshot();
});
