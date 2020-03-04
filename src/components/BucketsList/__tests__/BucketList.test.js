import React from 'react';
import {render} from '@testing-library/react';
import BucketsList from '../BucketsList';

const buckets = [
  {
    node: {
      id: 'QnVja2V0Tm9kZTpoYXJuZXNzIHN0aWNreSB0ZWNobm9sb2dpZXN=',
      name: 'harness sticky technologies',
      deleted: false,
      createdOn: '2020-02-26T02:29:09+00:00',
      study: null,
    },
  },
  {
    node: {
      id: 'QnVja2V0Tm9kZTpoYXJuZXNzIHN0aWNreSB0ZWNobm9sb2dpZXN=',
      name: 'harness',
      deleted: false,
      createdOn: '2020-02-26T02:29:09+00:00',
      study: {
        id: 'U3R1ZHlOb2RlOlNEX1lXT0RMSjBP',
        name: 'facilitate open-source users',
        shortName: null,
        kfId: 'SD_YWODLJ00',
        createdAt: '2018-04-23T17:46:55+00:00',
        modifiedAt: '2020-03-04T16:11:18.238627+00:00',
      },
    },
  },
  {
    node: {
      id: 'QnVja2V0Tm9kZTpoYXJuZXNzIHN0aWNreSB0ZWNobm9sb2dpZXM=',
      name: 'harness sticky technologies',
      deleted: false,
      createdOn: '2020-02-26T02:29:09+00:00',
      study: {
        id: 'U3R1ZHlOb2RlOlNEX1lXT0RMSjBP',
        name: 'facilitate open-source users',
        shortName: null,
        kfId: 'SD_YWODLJ0O',
        createdAt: '2018-04-23T17:46:55+00:00',
        modifiedAt: '2020-03-04T16:11:18.238627+00:00',
      },
    },
  },
  {
    node: {
      id: 'QnVja2V0Tm9kZTpzeW5kaWNhdGUgZG90LWNvbSBjb250ZW50',
      name: 'syndicate dot-com content',
      deleted: true,
      createdOn: '2019-11-28T13:07:34+00:00',
      study: {
        id: 'U3R1ZHlOb2RlOlNEX1pWMlgxMzRW',
        name: 'optimize 24/7 bandwidth',
        shortName: null,
        kfId: 'SD_ZV2X134V',
        createdAt: '2018-07-01T20:02:17+00:00',
        modifiedAt: '2020-03-04T16:11:18.247815+00:00',
      },
    },
  },
  {
    node: {
      id: 'QnVja2V0Tm9kZTppdGVyYXRlIGltcGFjdGZ1bCBpbmZvLW1lZGlhcmllcw==',
      name: 'iterate impactful info-mediaries',
      deleted: false,
      createdOn: '2019-10-09T17:07:31+00:00',
      study: null,
    },
  },
];

it('renders empty bucket listing', async () => {
  const tree = render(<BucketsList buckets={[]} />);
  expect(tree.container).toMatchSnapshot();
});

it('renders bucket listing', async () => {
  const tree = render(<BucketsList buckets={buckets} />);
  expect(tree.container).toMatchSnapshot();
});
