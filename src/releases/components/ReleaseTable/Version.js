import React from 'react';
import {Table} from 'semantic-ui-react';

const Version = ({version}) => (
  <Table.Cell singleLine width="1">
    <code>{version}</code>
  </Table.Cell>
);

export default Version;
