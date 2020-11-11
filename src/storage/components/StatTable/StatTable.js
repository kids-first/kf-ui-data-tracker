import React from 'react';
import {Table} from 'semantic-ui-react';

const Row = ({data}) => (
  <Table.Row>
    <Table.Cell textAlign="right">{data.fileFormat}</Table.Cell>
    <Table.Cell>{data.value}</Table.Cell>
  </Table.Row>
);

const StatTable = ({data, valueFormatter, valueLabel = 'Value'}) => {
  const sortedData = data.sort((a, b) => a.value < b.value);
  const formattedData = sortedData.map(data => ({
    ...data,
    value: valueFormatter ? valueFormatter(data.value) : data.value,
  }));

  const header = (
    <Table.Row>
      <Table.HeaderCell textAlign="right">File Format</Table.HeaderCell>
      <Table.HeaderCell>{valueLabel}</Table.HeaderCell>
    </Table.Row>
  );
  return (
    <Table
      basic="very"
      celled
      compact
      tableData={formattedData}
      headerRow={header}
      renderBodyRow={(data, index) => <Row data={data} />}
    />
  );
};

export default StatTable;
