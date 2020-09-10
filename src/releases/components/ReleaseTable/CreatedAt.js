import React from 'react';
import {Table} from 'semantic-ui-react';

const CreatedAt = ({date}) => (
  <Table.Cell width="2">
    {new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })}
  </Table.Cell>
);

export default CreatedAt;
