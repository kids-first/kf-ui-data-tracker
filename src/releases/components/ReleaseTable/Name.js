import React from 'react';
import {Header, Table} from 'semantic-ui-react';

const Name = ({name, description}) => (
  <Table.Cell>
    <Header size="small">{name}</Header>
  </Table.Cell>
);

export default Name;
