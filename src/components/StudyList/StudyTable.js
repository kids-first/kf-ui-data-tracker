import React, {useState} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Amplitude} from '@amplitude/react-amplitude';
import {Header, Icon, Label, Popup, Table} from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import defaultAvatar from '../../assets/defaultAvatar.png';
import ActionButtons from './ActionButtons';
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

const renderRow = node => ({
  key: node.kfId,
  cells: [
    {
      key: 'name',
      selectable: true,
      className: 'overflow-cell-container',
      content: <StudyName study={node} />,
    },
    {
      key: 'kfId',
      width: 1,
      textAlign: 'center',
      selectable: true,
      content: <KfId kfId={node.kfId} />,
    },
    {
      key: 'version',
      textAlign: 'center',
      width: 1,
      selectable: true,
      content: (
        <Release
          release={node.release && node.release.node && node.release.node}
        />
      ),
    },
    {
      key: 'actions',
      textAlign: 'right',
      content: <ActionButtons study={node} />,
      width: 1,
    },
  ],
});

const StudyTable = ({
  studyList,
  loading,
  clickable = true,
  history,
  myProfile,
  isResearch,
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
      version: node.release.node ? node.release.node.version : '',
    }))
    .sort((s1, s2) => s1[sorting.column].localeCompare(s2[sorting.column]));

  const header = [
    <Table.HeaderCell
      key="name"
      content="Name"
      sorted={sorting.column === 'name' ? sorting.direction : null}
      onClick={handleSort('name')}
    />,
    <Table.HeaderCell
      key="kfId"
      content="Kids First ID"
      textAlign="center"
      sorted={sorting.column === 'kfId' ? sorting.direction : null}
      onClick={handleSort('kfId')}
    />,
    <Table.HeaderCell
      key="version"
      content="Version"
      textAlign="center"
      sorted={sorting.column === 'version' ? sorting.direction : null}
      onClick={handleSort('version')}
    />,
    {key: 'actions', content: 'Actions', textAlign: 'center'},
  ];

  return (
    <Amplitude
      eventProperties={inheritedProps => ({
        ...inheritedProps,
        scope: inheritedProps.scope
          ? [...inheritedProps.scope, 'study table']
          : ['study table'],
      })}
    >
      <Table
        singleLine
        striped
        selectable
        sortable
        celled
        headerRow={header}
        tableData={
          sorting.direction === 'ascending' ? studies : studies.reverse()
        }
        renderBodyRow={renderRow}
      />
    </Amplitude>
  );
};

export default withRouter(StudyTable);
