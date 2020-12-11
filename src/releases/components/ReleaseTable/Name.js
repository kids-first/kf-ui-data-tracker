import React from 'react';
import {Link} from 'react-router-dom';
import {Header, Table} from 'semantic-ui-react';

const Name = ({name, description, kfId}) => (
  <Table.Cell selectable>
    <Link to={`/releases/history/${kfId}`}>
      <Header size="small">{name}</Header>
    </Link>
  </Table.Cell>
);

export default Name;
