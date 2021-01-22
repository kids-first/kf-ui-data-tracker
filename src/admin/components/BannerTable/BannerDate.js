import React from 'react';
import {Table} from 'semantic-ui-react';

const BannerDate = ({date}) => (
  <Table.Cell>
    {date
      ? new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : '-'}
  </Table.Cell>
);

export default BannerDate;
