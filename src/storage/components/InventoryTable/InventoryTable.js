import React from 'react';
import {Icon, Table} from 'semantic-ui-react';
import {formatFileSize, formatLargeNumber} from '../../../documents/utilities';

const Row = ({data}) => (
  <Table.Row>
    <Table.Cell textAlign="left">
      {new Date(data.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </Table.Cell>
    <Table.Cell textAlign="center" width={2}>
      {formatLargeNumber(JSON.parse(data.summary).count.total)}
    </Table.Cell>
    <Table.Cell textAlign="center" width={2}>
      {formatFileSize(JSON.parse(data.summary).size.total, true)}
    </Table.Cell>
    <Table.Cell textAlign="center" width={1}>
      <Icon bordered name="download" />
    </Table.Cell>
  </Table.Row>
);

const InventoryTable = ({inventories}) => {
  if (!inventories) return 'Loading';

  const sortedInventories = inventories
    .map(({node}) => node)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const header = (
    <Table.Row>
      <Table.HeaderCell>Inventory</Table.HeaderCell>
      <Table.HeaderCell textAlign="center">Objects</Table.HeaderCell>
      <Table.HeaderCell textAlign="center">Data</Table.HeaderCell>
      <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
    </Table.Row>
  );

  return (
    <Table
      celled
      compact="very"
      headerRow={header}
      tableData={sortedInventories}
      renderBodyRow={(data, index) => <Row data={data} />}
    />
  );
};

export default InventoryTable;
