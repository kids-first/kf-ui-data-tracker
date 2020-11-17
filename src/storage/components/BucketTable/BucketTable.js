import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Header, Icon, Label, Table, Pagination} from 'semantic-ui-react';
import {formatFileSize, formatLargeNumber} from '../../../documents/utilities';

const extractSummary = node =>
  node.inventories && node.inventories.edges.length > 0
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
      {data.study ? data.study.kfId : 'Link'}
    </Table.Cell>
    <Table.Cell textAlign="center" width={2}>
      {formatLargeNumber(
        extractSummary(data) && extractSummary(data).total_count,
      )}
    </Table.Cell>
    <Table.Cell textAlign="center" width={2}>
      {formatFileSize(
        extractSummary(data) && extractSummary(data).total_size,
        true,
      )}
    </Table.Cell>
    <Table.Cell textAlign="center" width={2}>
      <Icon bordered size="small" name="download" />
      <Icon bordered size="small" name="external" />
    </Table.Cell>
  </Table.Row>
);

const stringSort = columnName => (a, b) =>
  b[columnName].localeCompare(a[columnName]);

const summarySort = summaryField => (a, b) => {
  const aSummary =
    a.inventories &&
    a.inventories.edges.length > 0 &&
    a.inventories.edges[0].node.summary &&
    extractSummary(a);
  const bSummary =
    b.inventories &&
    b.inventories.edges.length > 0 &&
    b.inventories.edges[0].node.summary &&
    extractSummary(b);

  if (!aSummary && !bSummary) return 0;
  if (!aSummary) return -1;
  if (!bSummary) return 1;

  const aVal = aSummary[summaryField] || 0;
  const bVal = bSummary[summaryField] || 0;
  return aVal - bVal;
};

const columnSorts = {
  name: stringSort('name'),
  objects: summarySort('total_count'),
  size: summarySort('total_size'),
  actions: (a, b) => 0,
};

const BucketTable = ({buckets, searchString = ''}) => {
  // Setup state for table
  const existingState = JSON.parse(localStorage.getItem('bucketTableState'));
  const defaultState = {
    version: 1,
    sorting: {
      column: 'name',
      direction: 'descending',
    },
  };

  const [page, setPage] = useState(1);
  const [tableState, setTableState] = useState(
    existingState && existingState.version === defaultState.version
      ? existingState
      : defaultState,
  );

  const handleSort = column => () => {
    const {sorting} = tableState;
    const direction =
      sorting.column !== column
        ? 'descending'
        : sorting.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    setTableState({
      ...tableState,
      sorting: {column, direction},
    });
    localStorage.setItem(
      'bucketTableState',
      JSON.stringify({
        sorting: {column, direction},
        version: defaultState.version,
      }),
    );
  };

  // Process buckets by sorting and filtering
  const filteredBuckets = buckets
    .map(({node}) => node)
    .filter(bucket => bucket.name.includes(searchString));

  let sortedBuckets = filteredBuckets.sort(
    (r1, r2) =>
      columnSorts.hasOwnProperty(tableState.sorting.column) &&
      columnSorts[tableState.sorting.column](r1, r2),
  );

  sortedBuckets =
    tableState.sorting.direction === 'ascending'
      ? sortedBuckets
      : sortedBuckets.reverse();

  const pagedBuckets = sortedBuckets.slice(10 * (page - 1), 10 * page);

  const header = (
    <Table.Row>
      {[
        {key: 'name', name: 'Bucket'},
        {key: 'study', name: 'Study'},
        {key: 'objects', name: 'Objects'},
        {key: 'size', name: 'Size'},
        {key: null, name: 'Actions'},
      ].map(({name, key}) => (
        <Table.HeaderCell
          key={key}
          textAlign="center"
          sorted={
            tableState.sorting.column === key
              ? tableState.sorting.direction
              : null
          }
          onClick={handleSort(key)}
        >
          {name}
        </Table.HeaderCell>
      ))}
    </Table.Row>
  );

  const pagination = (
    <Table.Row>
      <Table.HeaderCell colSpan="5" textAlign="right">
        <Pagination
          firstItem={null}
          lastItem={null}
          nextItem={{
            'aria-label': 'Next page',
            content: <Icon name="chevron right" />,
          }}
          prevItem={{
            'aria-label': 'Previous page',
            content: <Icon name="chevron left" />,
          }}
          activePage={!searchString ? page : 1}
          totalPages={Math.ceil(sortedBuckets.length / 10)}
          onPageChange={(e, {activePage}) => setPage(activePage)}
        />
      </Table.HeaderCell>
    </Table.Row>
  );

  if (!buckets) return 'Loading';

  return (
    <Table
      celled
      compact
      sortable
      headerRow={header}
      footerRow={pagination}
      tableData={pagedBuckets}
      renderBodyRow={(data, index) => <Row key={index} data={data} />}
    />
  );
};

export default BucketTable;
