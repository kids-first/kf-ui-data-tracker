import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Header, Icon, Table} from 'semantic-ui-react';
import {formatFileSize, formatLargeNumber} from '../../../documents/utilities';

const extractSummary = node =>
  node.inventories.edges.length > 0
    ? JSON.parse(node.inventories.edges[0].node.summary)
    : null;

const Row = ({data}) => (
  <Table.Row>
    <Table.Cell selectable>
      <Link to={'/storage/bucket/' + data.name}>
        <Header size="small">{data.name}</Header>
      </Link>
    </Table.Cell>
    <Table.Cell textAlign="center" width={1}>
      {data.study.kfId}
    </Table.Cell>
    <Table.Cell textAlign="center" width={2}>
      {formatLargeNumber(extractSummary(data).count.total)}
    </Table.Cell>
    <Table.Cell textAlign="center" width={2}>
      {formatFileSize(extractSummary(data).size.total, true)}
    </Table.Cell>
    <Table.Cell textAlign="center" width={1}>
      <Button.Group basic>
        <Button icon>
          <Icon name="download" />
        </Button>
        <Button icon>
          <Icon name="external" />
        </Button>
      </Button.Group>
    </Table.Cell>
  </Table.Row>
);

const BucketList = ({buckets}) => {
  if (!buckets) return 'Loading';

  const sortedBuckets = buckets.map(({node}) => node);

  const header = (
    <Table.Row>
      <Table.HeaderCell>Bucket</Table.HeaderCell>
      <Table.HeaderCell textAlign="center">Study</Table.HeaderCell>
      <Table.HeaderCell textAlign="center">Objects</Table.HeaderCell>
      <Table.HeaderCell textAlign="center">Data</Table.HeaderCell>
      <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
    </Table.Row>
  );

  return (
    <Table
      celled
      compact
      headerRow={header}
      tableData={sortedBuckets}
      renderBodyRow={(data, index) => <Row data={data} />}
    />
  );
};

export default BucketList;
