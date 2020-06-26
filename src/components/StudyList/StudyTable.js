import React from 'react';
import {withRouter} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import {Table} from 'semantic-ui-react';
import ActionButtons from './ActionButtons';
import KfId from './KfId';
import Release from './Release';
import SequencingStatus from './SequencingStatus';
import IngestionStatus from './IngestionStatus';
import PhenotypeStatus from './PhenotypeStatus';
import StudyName from './Name';
import {compareSemVer} from '../../common/sortUtils';

/**
 * A collection of functions to render cell contents for different columns
 */
const cellContent = {
  name: node => <StudyName study={node} key={node.kfId + 'name'} />,
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
  sequencingStatus: node => (
    <SequencingStatus key={node.kfId + 'sequencingStatus'} study={node} />
  ),
  ingestionStatus: node => (
    <IngestionStatus key={node.kfId + 'ingestionStatus'} study={node} />
  ),
  phenotypeStatus: node => (
    <PhenotypeStatus key={node.kfId + 'phenotypeStatus'} study={node} />
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

const renderRow = (node, columns) => ({
  key: node.kfId,
  cells: columns.map((col, i) => cellContent[col.key](node)),
  textAlign: 'center',
});

const stringSort = (a, b) =>
  a !== null && b !== null ? a.localeCompare(b) : 0;

const columnSorts = {
  name: stringSort,
  kfId: stringSort,
  version: compareSemVer,
  externalId: stringSort,
  actions: (a, b) => 0,
  sequencingStatus: stringSort,
  phenotypeStatus: stringSort,
  ingestionStatus: stringSort,
  anticipatedSamples: stringSort,
};

const StudyTable = ({
  studyList,
  loading,
  clickable = true,
  myProfile,
  isResearch,
  columns,
  handleSort,
}) => {
  if (loading && !studyList) {
    return <h2>loading studies</h2>;
  }

  const studies = studyList
    .map(({node}) => ({
      ...node,
      version:
        node.release && node.release.node ? node.release.node.version : '',
    }))
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
      sorted={
        columns.sorting.column === col.key ? columns.sorting.direction : null
      }
      onClick={handleSort(col.key)}
    />
  ));

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
        tableData={
          columns.sorting.direction === 'ascending'
            ? studies
            : studies.reverse()
        }
        renderBodyRow={data => renderRow(data, visibleCols)}
      />
    </Amplitude>
  );
};

export default withRouter(StudyTable);
