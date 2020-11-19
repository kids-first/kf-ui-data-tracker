import React from 'react';
import {Table} from 'semantic-ui-react';
import {formatFileSize, formatLargeNumber} from '../../../documents/utilities';

const Row = ({data}) => (
  <Table.Row>
    <Table.Cell textAlign="right">{data.metric}</Table.Cell>
    <Table.Cell textAlign="center">{data.size}</Table.Cell>
    <Table.Cell textAlign="center">{data.count}</Table.Cell>
  </Table.Row>
);

const StatTable = ({sizeData, countData, labelMap = {}}) => {
  if (!sizeData || !countData) return 'loading';

  const sizes = sizeData.reduce((o, k) => ({...o, [k.metric]: k.value}), {});
  const counts = countData.reduce((o, k) => ({...o, [k.metric]: k.value}), {});

  const combinedData = Object.keys(sizes)
    .map(k => ({
      metric: k,
      size: sizes[k],
      count: counts[k],
    }))
    .sort((a, b) => b.size - a.size);

  const formattedData = combinedData.map(({metric, size, count}) => ({
    metric: metric in labelMap ? labelMap[metric] : metric,
    size: formatFileSize(size, true),
    count: formatLargeNumber(count),
  }));

  const header = (
    <Table.Row>
      <Table.HeaderCell></Table.HeaderCell>
      <Table.HeaderCell textAlign="center">Size</Table.HeaderCell>
      <Table.HeaderCell textAlign="center">Count</Table.HeaderCell>
    </Table.Row>
  );
  return (
    <Table
      definition
      compact="very"
      tableData={formattedData}
      headerRow={header}
      renderBodyRow={(data, index) => <Row key={index} data={data} />}
    />
  );
};

export default StatTable;
