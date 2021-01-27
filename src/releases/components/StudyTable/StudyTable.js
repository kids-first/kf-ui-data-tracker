import React, {useState} from 'react';
import {Checkbox, Loader, Pagination, Table} from 'semantic-ui-react';
import KfId from '../../../components/StudyList/KfId';
import CreatedAt from '../../components/ReleaseTable/CreatedAt';
import Version from '../../components/ReleaseTable/Version';
import {compareSemVer} from '../../../common/sortUtils';

const stringSort = (a, b) =>
  a !== null && b !== null ? a.localeCompare(b) : 0;
const dateSort = (a, b) =>
  a !== null && b !== null ? Date.parse(b) - Date.parse(a) : 0;

const PAGESIZE = 8;

const columnSorts = {
  name: stringSort,
  kfId: stringSort,
  version: compareSemVer,
  lastPublished: dateSort,
  state: stringSort,
};

const StudyTable = ({studies, selected, onChange}) => {
  const defaultState = {
    columns: [
      {key: 'select', name: '', visible: true},
      {key: 'version', name: 'Version', visible: true},
      {key: 'lastPublished', name: 'Published At', visible: true},
      {key: 'kfId', name: 'Kids First ID', visible: true},
      {key: 'name', name: 'Name', visible: true},
    ],
    sorting: {
      column: 'version',
      direction: 'descending',
    },
    page: 1,
  };

  const [columns, setColumns] = useState(defaultState);

  const cellContent = {
    select: node => (
      <Table.Cell collapsing textAlign="center" width="1" key="checkbox">
        <Checkbox
          key={node.id}
          checked={!!selected.filter(s => s.id === node.id).length}
        />
      </Table.Cell>
    ),
    name: node => node.name,
    kfId: node => <KfId kfId={node.kfId} key={node.kfId + 'kfId'} />,
    version: node => (
      <Version key={node.kfId + 'version'} version={node.version} />
    ),
    lastPublished: node => (
      <CreatedAt key={'lastPublished'} date={node.lastPublished} />
    ),
  };

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

  if (!studies) {
    return <Loader active content="Loading Studies" />;
  }

  const visibleCols = columns.columns.filter(col => col.visible);

  const flattenedStudies = [...studies].map(study => {
    const augmentedStudy = {...study};
    if (study.releases.edges.length) {
      augmentedStudy.version = study.releases.edges[0].node.version;
      if (!study.version) augmentedStudy.version = '-';
      augmentedStudy.lastPublished = study.releases.edges[0].node.createdAt;
    } else {
      augmentedStudy.version = '-';
      augmentedStudy.lastPublished = null;
    }
    return augmentedStudy;
  });
  const sortedStudies = flattenedStudies
    .sort((a, b) => b.kfId.localeCompare(a.kfId))
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
      sorted={
        columns.sorting.column === col.key ? columns.sorting.direction : null
      }
      onClick={i !== 0 ? handleSort(col.key) : null}
    />
  ));

  const pagination = () => (
    <Table.Row>
      <Table.HeaderCell colSpan={visibleCols.length + 1}>
        <Pagination
          floated="right"
          boundaryRange={0}
          onPageChange={(e, {activePage}) =>
            setColumns({...columns, page: activePage})
          }
          defaultActivePage={1}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          siblingRange={1}
          totalPages={Math.floor(studies.length / PAGESIZE)}
        />
      </Table.HeaderCell>
    </Table.Row>
  );

  const renderRow = (node, index, columns) => ({
    key: node.kfId,
    cells: columns.map((col, i) => cellContent[col.key](node)),
    onClick: e => onChange(node),
  });

  return (
    <Table
      selectable
      striped
      sortable
      celled
      headerRow={header}
      tableData={
        columns.sorting.direction === 'ascending'
          ? sortedStudies.slice(
              (columns.page - 1) * PAGESIZE,
              columns.page * PAGESIZE,
            )
          : sortedStudies
              .reverse()
              .slice((columns.page - 1) * PAGESIZE, columns.page * PAGESIZE)
      }
      renderBodyRow={(data, i) => renderRow(data, i, visibleCols)}
      footerRow={studies.length / PAGESIZE > 1 && pagination}
    />
  );
};

export default StudyTable;
