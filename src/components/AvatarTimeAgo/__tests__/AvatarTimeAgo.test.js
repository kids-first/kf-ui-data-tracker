import React from 'react';
import {render, cleanup} from 'react-testing-library';
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
