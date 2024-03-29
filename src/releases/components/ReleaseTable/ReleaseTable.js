import React, {useState} from 'react';
import {Loader, Table} from 'semantic-ui-react';
import KfId from '../../../components/StudyList/KfId';
import Version from './Version';
import ReleaseDate from './ReleaseDate';
import Name from './Name';
import {compareSemVer} from '../../../common/sortUtils';

const stringSort = (a, b) =>
  a !== null && b !== null ? a.localeCompare(b) : 0;
const dateSort = (a, b) =>
  a !== null && b !== null ? Date.parse(b) - Date.parse(a) : 0;

const columnSorts = {
  name: stringSort,
  kfId: stringSort,
  version: compareSemVer,
  createdAt: dateSort,
  endedAt: dateSort,
  state: stringSort,
};

const cellContent = {
  name: node => (
    <Name
      name={node.name}
      key={node.kfId + 'name'}
      description={node.description}
      kfId={node.kfId}
    />
  ),
  kfId: node => <KfId kfId={node.kfId} key={node.kfId + 'kfId'} />,
  version: node => (
    <Version version={node.version} key={node.kfId + 'version'} />
  ),
  createdAt: node => (
    <ReleaseDate date={node.createdAt} key={node.kfId + 'createdAt'} />
  ),
  endedAt: node => (
    <ReleaseDate date={node.endedAt} key={node.kfId + 'endedAt'} />
  ),
  state: node => (
    <Table.Cell width="1" key={node.kfId + 'state'}>
      {node.state
        ? node.state.charAt(0).toUpperCase() + node.state.slice(1)
        : '-'}
    </Table.Cell>
  ),
};

const ReleaseTable = ({releases, footer}) => {
  const defaultState = {
    columns: [
      {key: 'name', name: 'Name', visible: true},
      {key: 'version', name: 'Version', visible: true},
      {key: 'createdAt', name: 'Started At', visible: true},
      {key: 'endedAt', name: 'Ended At', visible: true},
      {key: 'kfId', name: 'Kids First ID', visible: true},
      {key: 'state', name: 'State', visible: true},
    ],
    sorting: {
      column: 'version',
      direction: 'descending',
    },
  };

  const [columns, setColumns] = useState(defaultState);
  const handleSort = column => () => {
    const direction =
      columns.sorting.column !== column
        ? 'ascending'
        : columns.sorting.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    setColumns({
      ...columns,
      sorting: {column, direction},
    });
  };

  if (!releases) {
    return <Loader active content="Loading Releases" />;
  }

  const visibleCols = columns.columns.filter(col => col.visible);

  const sortedReleases = releases
    .map(({node}) => node)
    .sort(
      (s1, s2) =>
        s1.hasOwnProperty(columns.sorting.column) &&
        s2.hasOwnProperty(columns.sorting.column) &&
        columnSorts.hasOwnProperty(columns.sorting.column) &&
        columnSorts[columns.sorting.column](
          s1[columns.sorting.column],
          s2[columns.sorting.column],
        ),
    );

  const header = visibleCols.map((col, i) => (
    <Table.HeaderCell
      key={col.key}
      content={col.name}
      textAlign="center"
      sorted={
        columns.sorting.column === col.key ? columns.sorting.direction : null
      }
      onClick={handleSort(col.key)}
    />
  ));

  const renderRow = (node, index, columns) => ({
    key: node.kfId,
    cells: columns.map((col, i) => cellContent[col.key](node)),
    positive: node.state === 'published',
  });

  return (
    <Table
      selectable
      striped
      sortable
      celled
      headerRow={header}
      footerRow={footer}
      tableData={
        columns.sorting.direction === 'ascending'
          ? sortedReleases
          : sortedReleases.reverse()
      }
      renderBodyRow={(data, i) => renderRow(data, i, visibleCols)}
    />
  );
};

export default ReleaseTable;
