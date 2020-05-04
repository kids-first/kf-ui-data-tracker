import React, {useState} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import {Header, Icon, Label, Popup, Table} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import defaultAvatar from '../../assets/defaultAvatar.png';
import ActionButtons from './ActionButtons';
import SequencingStatus from './SequencingStatus';
import Release from './Release';

const StudyName = ({study}) => {
  // TODO: Filter out only users in the Investigators group
  const investigators =
    study.collaborators.edges.length &&
    study.collaborators.edges.map(({node}) => node);

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'study name']
          : ['study name'],
      })}
    >
      {({logEvent}) => (
        <Link
          to={'/study/' + study.kfId + '/basic-info/info'}
          onClick={() => logEvent('click')}
          className="overflow-cell"
        >
          <Header size="medium" alt={study.name}>
            {study.name}
            <Header.Subheader>
              <Investigators investigators={investigators} />
            </Header.Subheader>
          </Header>
        </Link>
      )}
    </Amplitude>
  );
};

const Investigators = ({investigators}) => {
  if (investigators.length) {
    return (
      <Label.Group>
        {investigators.map(user => (
          <Label image key={user.id}>
            <img alt={user.username} src={user.picture || defaultAvatar} />
            {user.username}
          </Label>
        ))}
      </Label.Group>
    );
  }
  return <span>No investigators</span>;
};

const KfId = ({kfId}) => {
  const [copied, setCopied] = useState(false);

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'kfid']
          : ['kfid'],
      })}
    >
      {({logEvent}) => (
        <Popup
          inverted
          position="top left"
          trigger={
            <CopyToClipboard
              text={kfId}
              onCopy={() => {
                setCopied(true);
                logEvent('copy');
                setTimeout(() => {
                  setCopied(false);
                }, 700);
              }}
            >
              <code>{kfId}</code>
            </CopyToClipboard>
          }
          content={
            copied ? <Icon name="check" color="green" /> : 'Copy to clipboard'
          }
        />
      )}
    </Amplitude>
  );
};

/**
 * A collection of functions to render cell contents for different columns
 */
const cellContent = {
  name: node => <StudyName study={node} />,
  kfId: node => <KfId kfId={node.kfId} />,
  version: node => (
    <Release release={node.release && node.release.node && node.release.node} />
  ),
  actions: node => <ActionButtons study={node} />,
  externalId: node => <code>{node.externalId}</code>,
  sequencingStatus: node => <SequencingStatus study={node} />,
  anticipatedSamples: node => node.anticipatedSamples || '-',
};

const renderRow = (node, columns) => ({
  key: node.kfId,
  cells: columns.map((col, i) => ({
    key: col.key,
    width: i !== 0 ? 1 : null,
    textAlign: i > 0 ? 'center' : 'left',
    selectable: col.key !== 'actions',
    singleLine: col.key !== 'name',
    className: i === 0 ? 'overflow-cell-container' : null,
    content: col.key in cellContent && cellContent[col.key](node),
  })),
});

const StudyTable = ({
  studyList,
  loading,
  clickable = true,
  history,
  myProfile,
  isResearch,
  columns,
}) => {
  const [sorting, setSorting] = useState({
    column: 'name',
    direction: 'descending',
  });

  if (loading) {
    return <h2>loading studies</h2>;
  }

  const handleSort = column => () => {
    if (sorting.column !== column) {
      setSorting({
        column,
        direction: 'ascending',
      });
    } else {
      setSorting({
        column,
        direction:
          sorting.direction === 'ascending' ? 'descending' : 'ascending',
      });
    }
  };

  const studies = studyList
    .map(({node}) => ({
      ...node,
      version:
        node.release && node.release.node ? node.release.node.version : '',
    }))
    .sort(
      (s1, s2) =>
        s1[sorting.column] &&
        s1[sorting.column].localeCompare(s2[sorting.column]),
    );

  // Construct header
  const visibleCols = [
    {key: 'name', name: 'Name', visible: true},
    ...columns.filter(col => col.visible),
    {key: 'actions', name: 'Actions', visible: true},
  ];
  const header = visibleCols.map((col, i) => (
    <Table.HeaderCell
      key={col.key}
      content={col.name}
      textAlign={i > 0 ? 'center' : 'left'}
      sorted={sorting.column === col.key ? sorting.direction : null}
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
      columns={columns.filter(col => col.visible).map(col => col.name)}
    >
      <Table
        striped
        sortable
        celled
        headerRow={header}
        tableData={
          sorting.direction === 'ascending' ? studies : studies.reverse()
        }
        renderBodyRow={data => renderRow(data, visibleCols)}
      />
    </Amplitude>
  );
};

export default withRouter(StudyTable);
