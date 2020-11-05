import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import {Table, Pagination, Icon} from 'semantic-ui-react';
import ActionButtons from './ActionButtons';
import KfId from './KfId';
import Release from './Release';
import StudyName from './Name';
import {compareSemVer} from '../../common/sortUtils';
import {STUDIES_PER_PAGE} from '../../common/globals';

/**
 * A collection of functions to render cell contents for different columns
 */
const cellContent = {
  name: (node, favoriteStudies, setFavoriteStudies) => (
    <StudyName
      study={node}
      key={node.kfId + 'name'}
      favoriteStudies={favoriteStudies}
      setFavoriteStudies={setFavoriteStudies}
    />
  ),
  kfId: node => <KfId kfId={node.kfId} key={node.kfId + 'kfId'} />,
  version: node => (
    <Release
      key={node.kfId + 'version'}
      release={node.release && node.release.node && node.release.node}
    />
  ),
  actions: node => <ActionButtons study={node} key={node.kfId + 'actions'} />,
  externalId: node => (
    <Table.Cell singleLine width="1" key={node.kfId + 'externalId'}>
      <code>{node.externalId}</code>
    </Table.Cell>
  ),
  anticipatedSamples: node => (
    <Table.Cell key={node.kfId + 'anticipatedSamples'} width="1">
      {node.anticipatedSamples || '-'}
    </Table.Cell>
  ),
  slackChannel: node => (
    <Table.Cell singleLine width="1" key={node.kfId + 'slackChannel'}>
      <code>{node.slackChannel ? node.slackChannel : '-'}</code>
    </Table.Cell>
  ),
  bucket: node => (
    <Table.Cell singleLine width="1" key={node.kfId + 'bucket'}>
      <code>{node.bucket ? node.bucket : '-'}</code>
    </Table.Cell>
  ),
};

const renderRow = (node, columns, favoriteStudies, setFavoriteStudies) => ({
  key: node.kfId,
  cells: columns.map((col, i) =>
    cellContent[col.key](node, favoriteStudies, setFavoriteStudies),
  ),
  textAlign: 'center',
});

const stringSort = (a, b) =>
  a !== null && b !== null ? a.localeCompare(b) : 0;
const intSort = (a, b) => (a !== null && b !== null ? a - b : 0);

const columnSorts = {
  name: stringSort,
  kfId: stringSort,
  version: compareSemVer,
  externalId: stringSort,
  actions: (a, b) => 0,
  anticipatedSamples: intSort,
};

const StudyTable = ({
  studyList,
  loading,
  clickable = true,
  myProfile,
  isResearch,
  columns,
  handleSort,
  favoriteStudies = [],
  setFavoriteStudies,
  tableType,
}) => {
  const [page, setPage] = useState(1);

  if (loading && !studyList) {
    return <h2>loading studies</h2>;
  }

  const sorting = tableType ? columns[tableType + 'Sorting'] : columns.sorting;

  const studies = studyList
    .map(({node}) => ({
      ...node,
      version:
        node.release && node.release.node ? node.release.node.version : '',
    }))
    .sort(
      (s1, s2) =>
        s1.hasOwnProperty(sorting.column) &&
        s2.hasOwnProperty(sorting.column) &&
        columnSorts.hasOwnProperty(sorting.column) &&
        columnSorts[sorting.column](s1[sorting.column], s2[sorting.column]),
    );

  // Construct header
  const visibleCols = [
    {key: 'name', name: 'Name', visible: true},
    ...columns.columns.filter(col => col.visible),
    {key: 'actions', name: 'Actions', visible: true},
  ];
  const header = visibleCols.map((col, i) => (
    <Table.HeaderCell
      key={col.key}
      content={col.name}
      textAlign={i > 0 ? 'center' : 'left'}
      sorted={sorting.column === col.key ? sorting.direction : null}
      onClick={handleSort(col.key, tableType)}
    />
  ));

  let pageCount = Math.ceil(studies.length / STUDIES_PER_PAGE);
  let sortedList =
    sorting.direction === 'ascending' ? studies : studies.reverse();
  let paginatedList = sortedList.slice(
    STUDIES_PER_PAGE * (page - 1),
    STUDIES_PER_PAGE * (page - 1) + STUDIES_PER_PAGE,
  );

  const pagination = logEvent => (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'study table pagination']
          : ['study table pagination'],
      })}
      columns={columns.columns.filter(col => col.visible).map(col => col.name)}
    >
      {({logEvent}) => (
        <Table.Row textAlign="right">
          <Table.HeaderCell colSpan={visibleCols.length + 1}>
            <Pagination
              size="mini"
              firstItem={null}
              lastItem={null}
              prevItem={{content: <Icon name="angle left" />, icon: true}}
              nextItem={{content: <Icon name="angle right" />, icon: true}}
              activePage={page}
              totalPages={pageCount}
              onPageChange={(e, {activePage}) => {
                setPage(activePage);
                logEvent('click');
              }}
            />
          </Table.HeaderCell>
        </Table.Row>
      )}
    </Amplitude>
  );

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'study table']
          : ['study table'],
      })}
      columns={columns.columns.filter(col => col.visible).map(col => col.name)}
    >
      <Table
        striped
        sortable
        celled
        headerRow={header}
        tableData={paginatedList}
        renderBodyRow={data =>
          renderRow(data, visibleCols, favoriteStudies, setFavoriteStudies)
        }
        footerRow={pageCount > 1 && pagination}
      />
    </Amplitude>
  );
};

export default withRouter(StudyTable);
