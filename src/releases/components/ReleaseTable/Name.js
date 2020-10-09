import React from 'react';
import {Link} from 'react-router-dom';
import {Header, Table} from 'semantic-ui-react';

const Name = ({name, description, kfId}) => (
  <Table.Cell>
    <Header as={Link} to={`/releases/history/${kfId}`} size="small">
      {name}
    </Header>
  </Table.Cell>
);

export default Name;
