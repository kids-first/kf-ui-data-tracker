import React from 'react';
import {Table} from 'semantic-ui-react';

const ReleaseDate = ({date}) => (
  <Table.Cell width="4" textAlign="center">
    {date
      ? new Date(date).toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '-'}
  </Table.Cell>
);

export default ReleaseDate;
